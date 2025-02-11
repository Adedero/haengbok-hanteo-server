import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";


export default async function deleteProperty (req: Request, res: Response) {
  try {
    //Delete the property
    //Bring back the listing
    const { id } = req.params;
    if (!id) {
      useResponse(res, 400, 'Property ID is required')
      return
    }
    const property = await db.Property.findById(id).lean()

    if (!property) {
      useResponse(res, 400, 'Property not found')
      return
    }

    await Promise.all([
      db.Property.deleteOne({ _id: property._id }),
      db.Listing.updateOne({ name: property.name }, { deleted: false })
    ])
    useResponse(res, 200, { property })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}