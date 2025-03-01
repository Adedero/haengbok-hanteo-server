"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Subschema for app details
const appDetailsSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    version: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    isNewVersionAvailable: { type: Boolean, required: true }
}, { _id: false } // Avoid creating an ID for this subschema
);
// Main settings schema
const settingsSchema = new mongoose_1.Schema({
    availableBalance: {
        type: Number,
        required: true,
        min: 0, // Balance must be non-negative
        default: 0
    },
    hideBalance: {
        type: Boolean,
        required: true,
        default: false
    },
    lang: {
        type: String,
        enum: ['en', 'ko'], // Restrict to predefined options
        required: true,
        default: 'ko'
    },
    darkMode: {
        type: Boolean,
        required: true,
        default: false, // Default value for darkMode
    },
    contactAddress: {
        type: String,
        default: ''
    },
    appDetails: {
        type: appDetailsSchema, // Reference the subschema
        required: true,
    },
}, {
    timestamps: true, // Add createdAt and updatedAt fields
});
// Export the model
const Settings = (0, mongoose_1.model)('Settings', settingsSchema);
exports.default = Settings;
