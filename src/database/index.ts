import dotenv from 'dotenv'
import mongoose, { Model } from 'mongoose'
import { isProductionEnv } from '..'
import logger from '../config/winston.config'
import User, { type UserModel } from '../models/user.model'
import OTP, { type OTPModel } from '../models/otp.model'
import Transaction, { type TransactionModel } from '../models/transaction.model'
import Trade, { type TradeModel } from '../models/trade.model'
import Property, { type PropertyModel } from '../models/property.model'
import Settings, { type SettingsModel } from '../models/settings.model'
import Notification, { type NotificationModel } from '../models/notification.model'
import Listing, { type ListingModel } from '../models/listing.model'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((error) => {
    if (isProductionEnv) logger.error((error as Error).message)
    else console.error(error)
    process.exit(1)
  })
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
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('Database connection closed due to app termination')
  process.exit(0)
})

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
