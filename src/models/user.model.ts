import { Schema, model, Document } from 'mongoose'

export interface UserModel extends Document {
  name: string
  email: string
  password: string
  role: 'USER' | 'ADMIN'
  verified: boolean
  kyc?: {
    idType?: string
    document?: string
    ext?: string
    status?: 'pending' | 'successful' | 'failed',
    submittedAt?: Date
    verifiedAt?: Date
  }
  gender: 'female' | 'male' | 'other'
  birthday: Date
  location: { country: string; region?: string }
  picture?: string
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
    kyc: { 
      idType: { type: String, required: false },
      document: { type: String, required: false },
      ext: { type: String, required: false },
      status: { type: String, enum: ['pending', 'successful', 'failed'] },
      submittedAt: { type: Date, required: false },
      verifiedAt: { type: Date, required: false }
    },
    gender: { type: String, enum: ['female', 'male', 'other'], required: true },
    birthday: { type: Date, required: true },
    location: { country: String, region: String },
    picture: { type: String, required: false },
    token: { type: String },
    lastLogin: { type: Date }
  },
  { timestamps: true }
)

const User = model<UserModel>('User', userSchema)
export default User
