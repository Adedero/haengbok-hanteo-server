import { Request, Response } from 'express'
import { useResponse } from '../../../utils/use-response'
import { db } from '../../../database'
import { getAuthUser } from './login'
import * as argon from 'argon2'

export const confirmAccount = async (req: Request, res: Response) => {
  const { email } = req.query
  if (!email) {
    useResponse(res, 400, 'Enter your email')
    return
  }
  try {
    const user = await db.User.findOne({ email })
    if (!user) {
      useResponse(res, 400, 'Acount not found. Register to continue')
      return
    }
    const authUser = getAuthUser(user)
    useResponse(res, 200, { user: authUser })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { user_id, password } = req.query
  if (!user_id) {
    useResponse(res, 400, 'Something went wrong. Try again later')
    return
  }
  if (!password || password.length !== 6) {
    useResponse(res, 400, 'Invalid password')
    return
  }
  try {
    const user = await db.User.findById(user_id)
    if (!user) {
      useResponse(res, 400, 'Acount not found. Register to continue')
      return
    }
    const hash = await argon.hash(password.toString())
    user.password = hash
    await user.save()

    useResponse(res, 200, { success: true })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}
