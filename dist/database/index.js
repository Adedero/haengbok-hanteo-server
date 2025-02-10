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
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const winston_config_1 = __importDefault(require("../config/winston.config"));
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const trade_model_1 = __importDefault(require("../models/trade.model"));
const property_model_1 = __importDefault(require("../models/property.model"));
const settings_model_1 = __importDefault(require("../models/settings.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const listing_model_1 = __importDefault(require("../models/listing.model"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('MongoDB connected successfully');
})
    .catch((error) => {
    if (__1.isProductionEnv)
        winston_config_1.default.error(error.message);
    else
        console.error(error);
    process.exit(1);
});
/*
export default async function init() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    if (isProductionEnv) logger.error((error as Error).message)
    else console.error(error)
    process.exit(1)
  }
}
 */
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log('Database connection closed due to app termination');
    process.exit(0);
}));
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
