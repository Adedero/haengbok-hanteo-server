import { Request, Response } from "express";
import { db } from "../../../database";
import { useResponse } from "../../../utils/use-response";
import type { ExpressUser } from "../../../types";
import * as argon from "argon2"

export default async function changePassword (req: Request, res: Response) {
  const reqUser = req.user as ExpressUser
  const password = req.body
  if (!password || !password.current || !password.newValue) {
    useResponse(res, 400, 'Enter your current and new passwords')
    return
  }
  if (password.newValue.length < 6) {
    useResponse(res, 400, 'Password must have at least 6 characters')
    return
  }
  if (password.newValue === password.current) {
    useResponse(res, 400, 'Password is the same')
    return
  }
  try {
    const user = await db.User.findById(reqUser._id)
    if (!user) {
      useResponse(res, 400, 'Account not found')
      return
    }
    const isMatch = await argon.verify(user.password, password.current)
    if (!isMatch) {
      useResponse(res, 400, 'Wrong password. Enter your current password')
      return
    }
    const hash = await argon.hash(password.newValue)
    user.password = hash

    await user.save()

    useResponse(res, 200, { success: true  })
    
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}