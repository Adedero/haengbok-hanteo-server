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
exports.getAuthUser = void 0;
exports.default = login;
exports.useLogin = useLogin;
const dotenv_1 = require("dotenv");
const argon = __importStar(require("argon2"));
const jwt = __importStar(require("jsonwebtoken"));
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
(0, dotenv_1.config)();
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, email, password } = req.body;
        if (!password) {
            (0, use_response_1.useResponse)(res, 400, 'Password is required');
            return;
        }
        if (password.length < 6) {
            (0, use_response_1.useResponse)(res, 400, 'Password must have at least 6 characters');
            return;
        }
        if (!email) {
            (0, use_response_1.useResponse)(res, 400, 'Email is required');
            return;
        }
        try {
            const user = id
                ? yield database_1.db.User.findById(id)
                : yield database_1.db.User.findOne({ email });
            if (!user) {
                (0, use_response_1.useResponse)(res, 400, 'Your account was not found or may have been deleted. Register to continue.');
                return;
            }
            const [error, authUser] = yield useLogin(user, password);
            if (error || !authUser) {
                (0, use_response_1.useResponse)(res, 400, error.message);
                return;
            }
            yield database_1.db.Notification.create({
                user: authUser._id,
                title: 'New Login',
                message: 'You logged in to your account',
                isRead: false
            });
            (0, use_response_1.useResponse)(res, 200, { success: true, user: authUser });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
}
function useLogin(user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isMatch = yield argon.verify(user.password, password);
            if (!isMatch) {
                throw new Error('Password is not correct');
            }
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '3d' });
            user.token = token;
            user.verified = true;
            user.lastLogin = new Date(Date.now());
            yield user.save();
            const authUser = (0, exports.getAuthUser)(user);
            return [null, authUser];
        }
        catch (error) {
            return [error, null];
        }
    });
}
const getAuthUser = (user) => {
    const authUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        gender: user.gender,
        birthday: user.birthday,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: user.token,
        location: user.location,
        picture: user.picture,
        lastLogin: user.lastLogin,
        password: !!user.password
    };
    return authUser;
};
exports.getAuthUser = getAuthUser;
