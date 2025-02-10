"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = __importDefault(require("./services/register"));
const otp_1 = require("./services/otp");
const password_1 = __importDefault(require("./services/password"));
const login_1 = __importDefault(require("./services/login"));
const password_recovery_1 = require("./services/password-recovery");
const AuthController = {
    confirmAccount: password_recovery_1.confirmAccount,
    resetPassword: password_recovery_1.resetPassword,
    sendOtp: otp_1.sendOtp,
    setPassword: password_1.default,
    verifyOtp: otp_1.verifyOtp,
    login: login_1.default,
    register: register_1.default
};
exports.default = AuthController;
