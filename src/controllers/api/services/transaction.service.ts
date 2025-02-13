import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";
import sendEmail from "../../../utils/mailer";
import { transactionNotificationEmail } from "../../../templates/email";

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

    //send email,
    //send notifications to users
    await sendEmail({
      to_email: process.env.EMAIL_USER ?? 'info@haengbokhanteo.com',
      subject: 'New Transaction',
      html: transactionNotificationEmail({ transaction: txn.toObject() })
    })

    const users = await db.User.find()

    await Promise.all(
      users.map((user) => 
        db.Notification.create({
          user: user._id,
          title: 'New Transaction',
          message: `A new ${txn.type} transaction of ₩${txn.amount} was made.`,
          isRead: false
        })
      )
    )

    useResponse(res, 200, { item: txn, availableBalance: updatedSettings?.availableBalance ?? 0 })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}
