import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";

export default async function getAdminDashboard (req: Request, res: Response) {
  try {
    const [settings, transactionCount, propertyCount, user, lastTransaction, lastProperty] = await Promise.all([
      db.Settings.findOne({}).lean(),
      db.Transaction.estimatedDocumentCount(),
      db.Property.estimatedDocumentCount(),
      db.User.findOne({}).lean(),
      db.Transaction.findOne({}).sort({ transactionDate: -1 }).lean(),
      db.Property.findOne({}).sort({ createdAt: -1 }).lean()
    ])
    useResponse(res, 200, { settings, transactionCount, propertyCount, user, lastTransaction, lastProperty })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  } 
}