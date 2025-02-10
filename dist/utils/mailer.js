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
exports.default = sendEmail;
const dotenv_1 = require("dotenv");
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
(0, dotenv_1.config)();
function sendEmail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const FROM_EMAIL = (_b = (_a = options.from_email) !== null && _a !== void 0 ? _a : process.env.EMAIL_USER) !== null && _b !== void 0 ? _b : 'Haengbok Hanteo';
        try {
            const res = yield nodemailer_config_1.default.sendMail({
                from: FROM_EMAIL,
                to: options.email,
                subject: options.subject,
                text: (_c = options.text) !== null && _c !== void 0 ? _c : '',
                html: (_d = options.html) !== null && _d !== void 0 ? _d : ''
            });
            if (res.rejected.length > 0) {
                throw new Error(res.response);
            }
            return null;
        }
        catch (err) {
            return err;
        }
    });
}
