"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const listingSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    address: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    description: { type: String, required: false },
    pictures: { type: [String] },
    lat: { type: Number, required: false },
    long: { type: Number, required: false },
    deleted: { type: Boolean, required: false, default: false }
}, {
    timestamps: true
});
const Listing = (0, mongoose_1.model)('Listing', listingSchema);
exports.default = Listing;
