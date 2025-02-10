import { Document, Schema, model } from 'mongoose'

export interface ListingModel extends Document {
  name?: string
  address: string
  type: 'sale' | 'rent'
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  description?: string
  pictures?: string[]
  lat?: number
  long?: number
  deleted?: boolean
}

const listingSchema = new Schema<ListingModel>(
  {
    name: { type: String, required: false },
    address: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    description: { type: String, required: false },
    pictures: { type: [String] },
    lat: { type: Number, required: false },
    long: { type: Number, required: false },
    deleted: { type: Boolean, required: false, default: false }
  },
  {
    timestamps: true
  }
)

const Listing = model<ListingModel>('Listing', listingSchema)

export default Listing
