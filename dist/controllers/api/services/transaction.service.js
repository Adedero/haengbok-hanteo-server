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
exports.createTransaction = void 0;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const email_1 = require("../../../templates/email");
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = req.body;
    if (!data) {
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
        // Determine the increment/decrement value
        const adder = type === 'deposit' ? amountPaid : -amount;
        // Update available balance in a single atomic operation
        const updatedSettings = yield database_1.db.Settings.findOneAndUpdate({}, { $inc: { availableBalance: adder } }, { new: true } // Return the updated document
        ).lean();
        // Save the transaction
        yield txn.save();
        //send email,
        //send notifications to users
        yield (0, mailer_1.default)({
            to_email: (_a = process.env.EMAIL_USER) !== null && _a !== void 0 ? _a : 'info@haengbokhanteo.com',
            subject: 'New Transaction',
            html: (0, email_1.transactionNotificationEmail)({ transaction: txn.toObject() })
        });
        const users = yield database_1.db.User.find();
        yield Promise.all(users.map((user) => database_1.db.Notification.create({
            user: user._id,
            title: 'New Transaction',
            message: `A new ${txn.type} transaction of ₩${txn.amount} was made.`,
            isRead: false
        })));
        (0, use_response_1.useResponse)(res, 200, { item: txn, availableBalance: (_b = updatedSettings === null || updatedSettings === void 0 ? void 0 : updatedSettings.availableBalance) !== null && _b !== void 0 ? _b : 0 });
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.createTransaction = createTransaction;
