import { Schema, model, Document } from 'mongoose'

export interface UserModel extends Document {
  name: string
  email: string
  password: string
  role: 'USER' | 'ADMIN'
  verified: boolean
  gender: 'female' | 'male' | 'other'
  birthday: Date
  location: { country: string; region?: string }
  picture?: { url: string; name: string }
  token: string
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserModel>(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, required: true, enum: ['USER', 'ADMIN'] },
    verified: { type: Boolean, required: true, default: false },
    gender: { type: String, enum: ['female', 'male', 'other'], required: true },
    birthday: { type: Date, required: true },
    location: { country: String, region: String },
    picture: { type: { url: String, name: String }, required: false },
    token: { type: String },
    lastLogin: { type: Date }
  },
  { timestamps: true }
)

const User = model<UserModel>('User', userSchema)
export default User
