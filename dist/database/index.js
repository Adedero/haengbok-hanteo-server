"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const trade_model_1 = __importDefault(require("../models/trade.model"));
const property_model_1 = __importDefault(require("../models/property.model"));
const settings_model_1 = __importDefault(require("../models/settings.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const listing_model_1 = __importDefault(require("../models/listing.model"));
exports.db = {
    User: user_model_1.default,
    OTP: otp_model_1.default,
    Transaction: transaction_model_1.default,
    Trade: trade_model_1.default,
    Listing: listing_model_1.default,
    Property: property_model_1.default,
    Settings: settings_model_1.default,
    Notification: notification_model_1.default
};
