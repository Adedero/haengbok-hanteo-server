"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    value: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value.toString().length === 6;
            },
            message: 'OTP value must be 6 digits long'
        }
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 60 * 60 * 1000)
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
const OTP = (0, mongoose_1.model)('OTP', otpSchema);
exports.default = OTP;
