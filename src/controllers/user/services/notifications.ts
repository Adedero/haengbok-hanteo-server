import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";
import { ExpressUser } from "../../../types";

export const updateNotifications = async (req: Request, res: Response) => {
  const { notifications } = req.body;

  if (!notifications) {
    return useResponse(res, 400, "No notifications provided");
  }
  if (!Array.isArray(notifications)) {
    return useResponse(res, 400, "Bad request - notifications should be an array");
  }

  try {
    await Promise.all(
      notifications.map((notification) => {
        if (!notification._id) {
          throw new Error("Notification ID is required");
        }
        return db.Notification.updateOne(
          { _id: notification._id },
          { isRead: true }
        );
      })
    );

    // Send success response
    useResponse(res, 200, "Notifications updated successfully")
    return 
  } catch (error) {
    console.error("Error updating notifications:", error);
    return useResponse(res, 500, "Failed to update notifications");
  }
};


export const clearUserNotifications = async (req: Request, res: Response) => {

  const user = req.user as ExpressUser
  try {
    await db.Notification.deleteMany({ user: user._id })
    useResponse(res, 200, "Notifications cleared successfully")
    return
  } catch (error) {
    console.error(error)
    useResponse(res, 500, "Failed to clear notifications");
  }
};
