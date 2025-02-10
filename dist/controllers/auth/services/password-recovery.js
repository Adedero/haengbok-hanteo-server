"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.resetPassword = exports.confirmAccount = void 0;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
const login_1 = require("./login");
const argon = __importStar(require("argon2"));
const confirmAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    if (!email) {
        (0, use_response_1.useResponse)(res, 400, 'Enter your email');
        return;
    }
    try {
        const user = yield database_1.db.User.findOne({ email });
        if (!user) {
            (0, use_response_1.useResponse)(res, 400, 'Acount not found. Register to continue');
            return;
        }
        const authUser = (0, login_1.getAuthUser)(user);
        (0, use_response_1.useResponse)(res, 200, { user: authUser });
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.confirmAccount = confirmAccount;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, password } = req.query;
    if (!user_id) {
        (0, use_response_1.useResponse)(res, 400, 'Something went wrong. Try again later');
        return;
    }
    if (!password || password.length !== 6) {
        (0, use_response_1.useResponse)(res, 400, 'Invalid password');
        return;
    }
    try {
        const user = yield database_1.db.User.findById(user_id);
        if (!user) {
            (0, use_response_1.useResponse)(res, 400, 'Acount not found. Register to continue');
            return;
        }
        const hash = yield argon.hash(password.toString());
        user.password = hash;
        yield user.save();
        (0, use_response_1.useResponse)(res, 200, { success: true });
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.resetPassword = resetPassword;
