"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, required: true, enum: ['USER', 'ADMIN'] },
    verified: { type: Boolean, required: true, default: false },
    kyc: {
        idType: { type: String, required: false },
        document: { type: String, required: false },
        ext: { type: String, required: false },
        status: { type: String, enum: ['pending', 'successful', 'failed'] },
        submittedAt: { type: Date, required: false },
        verifiedAt: { type: Date, required: false }
    },
    gender: { type: String, enum: ['female', 'male', 'other'], required: true },
    birthday: { type: Date, required: true },
    location: { country: String, region: String },
    picture: { type: String, required: false },
    token: { type: String },
    lastLogin: { type: Date }
}, { timestamps: true });
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
