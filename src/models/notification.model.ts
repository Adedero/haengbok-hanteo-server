import { model, Schema } from "mongoose";

export interface NotificationModel {
  user: Schema.Types.ObjectId
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<NotificationModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

const Notification = model<NotificationModel>('Notification', NotificationSchema)

export default Notification