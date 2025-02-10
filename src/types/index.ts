import { Document } from 'mongoose'

export interface ExpressUser {
  _id: Document['_id']
  name: string
  email: string
  verified: boolean
  role: 'USER' | 'ADMIN'
  token: string
}
