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
exports.verifyOtp = exports.sendOtp = void 0;
const use_response_1 = require("../../../utils/use-response");
const database_1 = require("../../../database");
const pin_generator_1 = require("../../../utils/pin-generator");
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const email_1 = require("../../../templates/email");
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    if (!email) {
        (0, use_response_1.useResponse)(res, 400, 'Email is required');
        return;
    }
    try {
        const user = yield database_1.db.User.findOne({ email }).lean();
        if (!user) {
            (0, use_response_1.useResponse)(res, 400, 'No user with this email was found');
            return;
        }
        /* if (user.verified) {
          useResponse(res, 200, {
            verified: user.verified,
            hasPassword: !!user.password
          })
          return
        } */
        const EXPIRY_TIME = '1 hour';
        let otp = yield database_1.db.OTP.findOne({ user: user._id });
        if (!otp) {
            otp = yield database_1.db.OTP.create({
                user: user._id,
                value: (0, pin_generator_1.generateRandomPin)(6),
                expires: (0, pin_generator_1.setPinExpiryDate)(EXPIRY_TIME)
            });
        }
        if ((0, pin_generator_1.isPinExpired)(otp.expiresAt)) {
            otp.value = parseInt((0, pin_generator_1.generateRandomPin)(6));
            otp.expiresAt = (0, pin_generator_1.setPinExpiryDate)(EXPIRY_TIME);
            yield otp.save();
        }
        //const text = `Your secure OTP: ${otp.value}. Note that this password expires in ${EXPIRY_TIME}`
        const html = (0, email_1.accountVerificationEmail)({ otp: otp.value, expiry_date: EXPIRY_TIME });
        const mailError = yield (0, mailer_1.default)({
            to_email: user.email,
            subject: 'Haengbok-Hanteo Account Verification',
            html
        });
        if (mailError) {
            (0, use_response_1.useResponse)(res, 500, 'Could not send email. Try again later.');
            return;
        }
        (0, use_response_1.useResponse)(res, 200, {
            message: 'Verification email sent successfully',
            verified: false
        });
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.query;
    if (!email || !password) {
        (0, use_response_1.useResponse)(res, 400, 'Email and password are required');
        return;
    }
    if (password.length !== 6) {
        (0, use_response_1.useResponse)(res, 400, 'Invalid password');
        return;
    }
    try {
        const user = yield database_1.db.User.findOne({ email });
        if (!user) {
            (0, use_response_1.useResponse)(res, 400, 'This account does not exits or may have been deleted');
            return;
        }
        const message = 'Account verification completed';
        if (user.verified) {
            yield database_1.db.OTP.deleteOne({ user: user._id });
            yield sendNotification(user._id);
            (0, use_response_1.useResponse)(res, 200, {
                message,
                verified: user.verified,
                hasPassword: !!user.password
            });
            return;
        }
        const validatedOtp = yield validateOtp(user._id, password);
        if (!validatedOtp.valid) {
            (0, use_response_1.useResponse)(res, 400, validatedOtp.message);
            return;
        }
        user.verified = true;
        yield Promise.all([
            user.save(),
            sendNotification(user._id)
        ]);
        (0, use_response_1.useResponse)(res, 200, {
            message,
            verified: user.verified,
            hasPassword: !!user.password
        });
    }
    catch (error) {
        (0, use_response_1.useResponse)(res, 500, error.message);
    }
});
exports.verifyOtp = verifyOtp;
function validateOtp(userId, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const otp = parseInt(password);
        if (isNaN(otp)) {
            return {
                value: password,
                valid: false,
                message: 'The OTP provided is invalid'
            };
        }
        const existingOtp = yield database_1.db.OTP.findOne({ user: userId });
        if (!existingOtp) {
            return {
                value: otp,
                valid: false,
                message: 'The OTP provided has expired. Try generating a new one.'
            };
        }
        if ((0, pin_generator_1.isPinExpired)(existingOtp.expiresAt)) {
            yield existingOtp.deleteOne();
            return {
                value: otp,
                valid: false,
                message: 'The OTP has expired. Try generating a new one.'
            };
        }
        const isOtpCorrect = otp === existingOtp.value;
        if (!isOtpCorrect) {
            return {
                value: otp,
                valid: false,
                message: 'The OTP provided is incorrect. Check your email address and try again.'
            };
        }
        yield existingOtp.deleteOne();
        return {
            value: otp,
            valid: true,
            message: 'OTP is valid and correct'
        };
    });
}
function sendNotification(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.db.Notification.create({
                user: userId,
                title: 'Account Verification',
                message: 'Your account has been verified. You can set up your password if you haven\'t already',
                isRead: false
            });
        }
        catch (error) {
            throw error;
        }
    });
}
