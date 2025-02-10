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
exports.default = contactCustomerCare;
const use_response_1 = require("../../../utils/use-response");
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const email_1 = require("../../../templates/email");
function contactCustomerCare(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
            (0, use_response_1.useResponse)(res, 400, 'Name, email, and message are required');
            return;
        }
        const { name, email, subject, message } = req.body;
        try {
            const error = yield (0, mailer_1.default)({
                to_email: (_a = process.env.EMAIL) !== null && _a !== void 0 ? _a : 'nathan44wilson@gmail.com',
                from_email: email,
                subject,
                html: (0, email_1.helpEmail)({ name, email, message, subject })
            });
            if (error) {
                (0, use_response_1.useResponse)(res, 400, 'Failed to send email. Try again later');
                return;
            }
            (0, use_response_1.useResponse)(res, 200, { success: true });
        }
        catch (error) {
            (0, use_response_1.useResponse)(res, 500, error.message);
        }
    });
}
