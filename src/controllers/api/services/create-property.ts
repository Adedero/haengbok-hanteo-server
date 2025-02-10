import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";

export default async function createProperty (req: Request, res: Response) {
  try {
    const listing = await db.Listing.findOne({ deleted: false }).lean()
    if (!listing) {
      useResponse(res, 400, 'No properties to add. Try again later')
      return
    }
    const property = new db.Property(listing)
    await Promise.all([
      property.save(),
      db.Listing.updateOne({ _id: listing._id }, { deleted: true }),
    ])
    useResponse(res, 200, { property })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}