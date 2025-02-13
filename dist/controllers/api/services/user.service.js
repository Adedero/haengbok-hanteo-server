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
exports.deleteUser = void 0;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        (0, use_response_1.useResponse)(res, 400, 'No user ID provided');
        return;
    }
    try {
        yield Promise.all([
            database_1.db.User.deleteOne({ _id: id }),
            database_1.db.Notification.deleteMany({ user: id })
        ]);
        (0, use_response_1.useResponse)(res, 200, 'User deleted');
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.deleteUser = deleteUser;
