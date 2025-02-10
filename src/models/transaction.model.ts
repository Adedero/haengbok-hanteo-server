import { Document, model, Schema } from 'mongoose'

export interface TransactionModel extends Document {
  title: string
  type: 'deposit' | 'withdrawal'
  status: 'pending' | 'successful' | 'failed'
  amount: number
  charges: number
  amountPaid: number
  recipientName: string
  transactionRef: string
  transactionDate: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}

const transactionSchema = new Schema<TransactionModel>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      required: true,
      default: 'pending'
    },
    amount: { type: Number, required: true, min: 0 },
    charges: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, required: true, min: 0 },
    recipientName: { type: String, required: true },
    transactionRef: { type: String, unique: true, required: true },
    transactionDate: { type: Date, required: true },
    description: { type: String, required: false, default: '' }
  },
  {
    timestamps: true
  }
)

const Transaction = model<TransactionModel>('Transaction', transactionSchema)

export default Transaction
