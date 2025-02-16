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
  const data = req.body
  if (!data) {
    return useResponse(res, 400, 'No transaction data provided')
  }

  try {
    const txn = new db.Transaction(data)
    const { type, status, amount, amountPaid } = txn

    // Save failed transactions immediately
    if (status === 'failed') {
      await txn.save()
      return useResponse(res, 200, { item: txn })
    }

    // Determine the increment/decrement value
    const adder: number = type === 'deposit' ? amountPaid : -amount

    // Update available balance in a single atomic operation
    const updatedSettings = await db.Settings.findOneAndUpdate(
      {}, 
      { $inc: { availableBalance: adder } }, 
      { new: true } // Return the updated document
    ).lean()

    // Save the transaction
    await txn.save()

    txnEmitter.emit('created', txn)

    useResponse(res, 200, { item: txn, availableBalance: updatedSettings?.availableBalance ?? 0 })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
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
