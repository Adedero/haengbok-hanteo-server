import { Document, Schema, model } from 'mongoose'

export interface PropertyModel extends Document {
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
  createdAt: Date
  updatedAt: Date
}

const propertySchema = new Schema<PropertyModel>(
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
  },
  {
    timestamps: true
  }
)

const Property = model<PropertyModel>('Property', propertySchema)

export default Property
