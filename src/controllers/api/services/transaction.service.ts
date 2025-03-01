import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";
import sendEmail from "../../../utils/mailer";
import { transactionNotificationEmail } from "../../../templates/email";
import { txnEmitter } from "../../../events/transaction.event";
import { TransactionModel } from "../../../models/transaction.model";
import { UserModel } from "../../../models/user.model";
import logger from "../../../config/winston.config";


export const createTransaction = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return useResponse(res, 400, 'No transaction data provided');
  }

  try {
    const txn = new db.Transaction(data);
    const { type, status, amount, amountPaid } = txn;

    // Save failed transactions immediately
    if (status === 'failed') {
      await txn.save();
      return useResponse(res, 200, { item: txn });
    }

    // Determine increment/decrement
    const adder = type === 'deposit' ? amountPaid : type === 'withdrawal' ? -amount : 0;

    // Fetch or create settings using upsert
    const settings = await db.Settings.findOneAndUpdate(
      {}, 
      { $setOnInsert: { availableBalance: 0, hideBalance: false, lang: 'ko', darkMode: false, contactAddress: '', appDetails: { name: 'Haengbok Hanteo', version: '7.0.1', releaseDate: new Date(), isNewVersionAvailable: false } } },
      { upsert: true, new: true }
    );

    // Update available balance
    settings.availableBalance = Math.max((settings.availableBalance ?? 0) + adder, 0);
    await settings.save();

    // Save transaction
    await txn.save();

    // Emit event (optional: use await if async listeners exist)
    txnEmitter.emit('created', txn);

    return useResponse(res, 200, { item: txn, availableBalance: settings.availableBalance });
  } catch (error) {
    return useResponse(res, 500, (error as Error).message);
  }
}


export const sendTransactionNotifications = async (txn: TransactionModel) => {
  try {
    const users = await db.User.find();

    const send = async (user: UserModel) => {
      try {
        await Promise.all([
          sendEmail({
            to_email: user.email,
            subject: 'New Transaction',
            html: transactionNotificationEmail({ transaction: txn.toObject() })
          }),
          db.Notification.create({
            user: user._id,
            title: 'New Transaction',
            message: `A new ${txn.type} transaction of ₩${txn.amount.toLocaleString()} was made.`,
            isRead: false
          })
        ]);
      } catch (err) {
        logger.error(`Error sending notification to ${user.email}: ${(err as Error).message}`, err);
      }
    };

    await Promise.all(users.map((user) => send(user)));
  } catch (err) {
    logger.error(`Error sending transaction notifications: ${(err as Error).message}`, err);
    throw err;
  }
};
