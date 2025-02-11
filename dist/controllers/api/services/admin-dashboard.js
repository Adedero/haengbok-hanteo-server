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
exports.default = getAdminDashboard;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
function getAdminDashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [settings, transactionCount, propertyCount, userCount, lastTransactions, lastProperties] = yield Promise.all([
                database_1.db.Settings.findOne({}).lean(),
                database_1.db.Transaction.estimatedDocumentCount(),
                database_1.db.Property.estimatedDocumentCount(),
                database_1.db.User.estimatedDocumentCount(),
                database_1.db.Transaction.find({}).sort({ transactionDate: -1 }).limit(3).lean(),
                database_1.db.Property.find({}).sort({ createdAt: -1 }).limit(3).lean()
            ]);
            (0, use_response_1.useResponse)(res, 200, { settings, transactionCount, propertyCount, userCount, lastTransactions, lastProperties });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
}
