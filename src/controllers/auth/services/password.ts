import { Request, Response } from 'express'
import { useResponse } from '../../../utils/use-response'
import { db } from '../../../database'
import * as argon from 'argon2'

export default async function setPassword(req: Request, res: Response) {
  const { userId, password } = req.body
  if (!userId) {
    useResponse(res, 400, 'User not verified')
    return
  }
  if (!password || password.length !== 6) {
    useResponse(res, 400, 'Invalid password')
    return
  }
  try {
    const user = await db.User.findById(userId)
    if (!user) {
      useResponse(
        res,
        400,
        'This accout does not exist or may have been deleted. Register to continue'
      )
      return
    }
    if (!user.verified) {
      useResponse(res, 400, 'Your account has not yet been verified')
      return
    }
    if (user.password) {
      useResponse(res, 400, 'Your password is already set. Log in to change it')
      return
    }
    const hash = await argon.hash(password)
    user.password = hash
    await user.save()

    useResponse(res, 200, { success: true })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}
