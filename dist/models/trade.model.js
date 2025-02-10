"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tradeSchema = new mongoose_1.Schema({
    property: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    agent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'successful'],
        required: true,
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    sellingPrice: {
        type: Number,
        required: function () {
            return this.type === 'sell';
        },
        min: 0
    },
    costPrice: {
        type: Number,
        required: function () {
            return this.type === 'buy';
        },
        min: 0
    },
    tradeDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
tradeSchema.virtual('netProfit').get(function () {
    if (this.sellingPrice !== undefined && this.costPrice !== undefined) {
        return this.sellingPrice - this.costPrice;
    }
    return undefined;
});
const Trade = (0, mongoose_1.model)('Trade', tradeSchema);
exports.default = Trade;
