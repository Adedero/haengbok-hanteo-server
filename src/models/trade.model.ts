import { Document, Schema, model } from 'mongoose'

export interface TradeModel extends Document {
  property: Schema.Types.ObjectId
  agent: Schema.Types.ObjectId
  status: 'pending' | 'successful'
  type: 'buy' | 'sell'
  sellingPrice?: number
  costPrice?: number
  tradeDate: Date
  notes?: string
}

const tradeSchema = new Schema<TradeModel>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'successful'],
      required: true,
      default: 'pending'
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true
    },
    sellingPrice: {
      type: Number,
      required: function () {
        return this.type === 'sell'
      },
      min: 0
    },
    costPrice: {
      type: Number,
      required: function () {
        return this.type === 'buy'
      },
      min: 0
    },
    tradeDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

tradeSchema.virtual('netProfit').get(function () {
  if (this.sellingPrice !== undefined && this.costPrice !== undefined) {
    return this.sellingPrice - this.costPrice
  }
  return undefined
})

const Trade = model<TradeModel>('Trade', tradeSchema)

export default Trade
