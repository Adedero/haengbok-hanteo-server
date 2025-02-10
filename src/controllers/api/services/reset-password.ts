import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import { db } from "../../../database";
import * as argon from 'argon2'

export default async function resetUserPassword (req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    useResponse(res, 400, 'User ID is required')
    return
  }
  try {
    const user = await db.User.findById(id)
    if (!user) {
      useResponse(res, 404, 'User not found')
      return
    }
    const password = '000000'
    const hash = await argon.hash(password)
    user.password = hash
    await user.save()
    useResponse(res, 200, { success: true })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  } 
}