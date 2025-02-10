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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getDashboard;
const database_1 = require("../../../database");
const use_response_1 = require("../../../utils/use-response");
function getDashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.user;
        try {
            const [settings, transactions, unreadNotifications] = yield Promise.all([
                database_1.db.Settings
                    .findOne({})
                    .lean(),
                database_1.db.Transaction
                    .find()
                    .sort({ transactionDate: 'desc' })
                    .limit(5)
                    .lean(),
                database_1.db.Notification
                    .countDocuments({ user: user._id, isRead: false })
            ]);
            (0, use_response_1.useResponse)(res, 200, { settings, transactions, unreadNotifications });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
}
