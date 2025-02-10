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
const index_1 = require("../../../database/index");
const use_response_1 = require("../../../utils/use-response");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.body) {
        (0, use_response_1.useResponse)(res, 400, 'All fields are required');
        return;
    }
    const data = {
        name: req.body.email,
        email: req.body.email,
        birthday: req.body.birthday,
        location: { country: req.body.country.name },
        gender: (_a = req.body.gender) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
        verified: false,
        role: (_b = req.body.role) !== null && _b !== void 0 ? _b : 'USER'
    };
    let user;
    try {
        user = yield index_1.db.User.findOne({ email: data.email }).lean();
        if (!user) {
            user = yield index_1.db.User.create(data);
            user = user.toObject();
        }
        if (user) {
            if (user.verified) {
                (0, use_response_1.useResponse)(res, 200, { user: Object.assign(Object.assign({}, user), { password: !!user.password }) });
                return;
            }
        }
        (0, use_response_1.useResponse)(res, 200, { user: Object.assign(Object.assign({}, user), { password: !!user.password }) });
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.default = register;
