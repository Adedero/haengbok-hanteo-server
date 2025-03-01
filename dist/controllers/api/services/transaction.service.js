"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransactionNotifications = exports.createTransaction = void 0;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const email_1 = require("../../../templates/email");
const transaction_event_1 = require("../../../events/transaction.event");
const winston_config_1 = __importDefault(require("../../../config/winston.config"));
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
        return (0, use_response_1.useResponse)(res, 400, 'No transaction data provided');
    }
    try {
        const txn = new database_1.db.Transaction(data);
        const { type, status, amount, amountPaid } = txn;
        // Save failed transactions immediately
        if (status === 'failed') {
            yield txn.save();
            return (0, use_response_1.useResponse)(res, 200, { item: txn });
        }
        // Determine increment/decrement
        const adder = type === 'deposit' ? amountPaid : type === 'withdrawal' ? -amount : 0;
        // Fetch or create settings using upsert
        const settings = yield database_1.db.Settings.findOneAndUpdate({}, { $setOnInsert: { availableBalance: 0, hideBalance: false, lang: 'ko', darkMode: false, contactAddress: '', appDetails: { name: 'Haengbok Hanteo', version: '7.0.1', releaseDate: new Date(), isNewVersionAvailable: false } } }, { upsert: true, new: true });
        // Update available balance
        settings.availableBalance = Math.max(((_a = settings.availableBalance) !== null && _a !== void 0 ? _a : 0) + adder, 0);
        yield settings.save();
        // Save transaction
        yield txn.save();
        // Emit event (optional: use await if async listeners exist)
        transaction_event_1.txnEmitter.emit('created', txn);
        return (0, use_response_1.useResponse)(res, 200, { item: txn, availableBalance: settings.availableBalance });
    }
    catch (error) {
        return (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.createTransaction = createTransaction;
const sendTransactionNotifications = (txn) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield database_1.db.User.find();
        const send = (user) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    (0, mailer_1.default)({
                        to_email: user.email,
                        subject: 'New Transaction',
                        html: (0, email_1.transactionNotificationEmail)({ transaction: txn.toObject() })
                    }),
                    database_1.db.Notification.create({
                        user: user._id,
                        title: 'New Transaction',
                        message: `A new ${txn.type} transaction of ₩${txn.amount.toLocaleString()} was made.`,
                        isRead: false
                    })
                ]);
            }
            catch (err) {
                winston_config_1.default.error(`Error sending notification to ${user.email}: ${err.message}`, err);
            }
        });
        yield Promise.all(users.map((user) => send(user)));
    }
    catch (err) {
        winston_config_1.default.error(`Error sending transaction notifications: ${err.message}`, err);
        throw err;
    }
});
exports.sendTransactionNotifications = sendTransactionNotifications;
