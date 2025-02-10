"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        required: true,
        default: 'pending'
    },
    amount: { type: Number, required: true, min: 0 },
    charges: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, required: true, min: 0 },
    recipientName: { type: String, required: true },
    transactionRef: { type: String, unique: true, required: true },
    transactionDate: { type: Date, required: true },
    description: { type: String, required: false, default: '' }
}, {
    timestamps: true
});
const Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.default = Transaction;
