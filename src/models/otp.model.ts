import { model, Schema } from 'mongoose'

export interface OTPModel {
  value: number
  expiresAt: Date
  user: Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const otpSchema = new Schema<OTPModel>(
  {
    value: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value.toString().length === 6
        },
        message: 'OTP value must be 6 digits long'
      }
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 60 * 1000)
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const OTP = model<OTPModel>('OTP', otpSchema)

export default OTP
