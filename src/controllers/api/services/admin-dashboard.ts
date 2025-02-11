import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";

export default async function getAdminDashboard (req: Request, res: Response) {
  try {
    const [settings, transactionCount, propertyCount, userCount, lastTransactions, lastProperties] = await Promise.all([
      db.Settings.findOne({}).lean(),
      db.Transaction.estimatedDocumentCount(),
      db.Property.estimatedDocumentCount(),
      db.User.estimatedDocumentCount(),
      db.Transaction.find({}).sort({ transactionDate: -1 }).limit(3).lean(),
      db.Property.find({}).sort({ createdAt: -1 }).limit(3).lean()
    ])
    useResponse(res, 200, { settings, transactionCount, propertyCount, userCount, lastTransactions, lastProperties })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  } 
}