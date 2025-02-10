import { Request, Response } from "express";
import { db } from "../../../database";
import { useResponse } from "../../../utils/use-response";
import type { ExpressUser } from "../../../types";

export default async function getDashboard (req: Request, res: Response) {
  const user = req.user as ExpressUser
  try {
    const [settings, transactions, unreadNotifications] = await Promise.all([
      db.Settings
        .findOne({})
        .lean(),
      db.Transaction
        .find()
        .sort({ transactionDate : 'desc'})
        .limit(5)
        .lean(),
      db.Notification
        .countDocuments({ user: user._id, isRead: false })
    ])
    useResponse(res, 200, { settings, transactions, unreadNotifications })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}