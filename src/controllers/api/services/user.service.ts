import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params

  if (!id) {
    useResponse(res, 400, 'No user ID provided')
    return
  }

  try {
    await Promise.all([
      db.User.deleteOne({ _id: id }),
      db.Notification.deleteMany({ user: id })
    ])
    useResponse(res, 200, 'User deleted')
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}