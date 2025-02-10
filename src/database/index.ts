import { Model } from 'mongoose'
import User, { type UserModel } from '../models/user.model'
import OTP, { type OTPModel } from '../models/otp.model'
import Transaction, { type TransactionModel } from '../models/transaction.model'
import Trade, { type TradeModel } from '../models/trade.model'
import Property, { type PropertyModel } from '../models/property.model'
import Settings, { type SettingsModel } from '../models/settings.model'
import Notification, { type NotificationModel } from '../models/notification.model'
import Listing, { type ListingModel } from '../models/listing.model'


export interface DBModels {
  User: Model<UserModel>
  OTP: Model<OTPModel>
  Transaction: Model<TransactionModel>
  Trade: Model<TradeModel>
  Listing: Model<ListingModel>
  Property: Model<PropertyModel>
  Settings: Model<SettingsModel>
  Notification: Model<NotificationModel>
}

export const db: DBModels = {
  User,
  OTP,
  Transaction,
  Trade,
  Listing,
  Property,
  Settings,
  Notification
}
