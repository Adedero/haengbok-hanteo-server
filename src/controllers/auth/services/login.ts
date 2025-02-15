import { config } from 'dotenv'
import { type Request, Response } from 'express'
import * as argon from 'argon2'
import { UserModel } from '../../../models/user.model'
import * as jwt from 'jsonwebtoken'
import { useResponse } from '../../../utils/use-response'
import { db } from '../../../database'

config()

const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret'

export default async function login(req: Request, res: Response) {
  const { id, email, password } = req.body
  if (!password) {
    useResponse(res, 400, 'Password is required')
    return
  }
  if (password.length < 6) {
    useResponse(res, 400, 'Password must have at least 6 characters')
    return
  }
  if (!email) {
    useResponse(res, 400, 'Email is required')
    return
  }
  try {
    const user = id
      ? await db.User.findById(id)
      : await db.User.findOne({ email })
    if (!user) {
      useResponse(
        res,
        400,
        'Your account was not found or may have been deleted. Register to continue.'
      )
      return
    }
    const [error, authUser] = await useLogin(user, password)
    if (error || !authUser) {
      useResponse(res, 400, (error as Error).message)
      return
    }

    await db.Notification.create({
      user: authUser._id,
      title: 'New Login',
      message: 'You logged in to your account',
      isRead: false
    })

    useResponse(res, 200, { success: true, user: authUser })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}

export async function useLogin(
  user: UserModel,
  password: string
): Promise<[Error | null, Record<string, unknown> | null]> {
  try {
    const isMatch = await argon.verify(user.password, password)
    if (!isMatch) {
      throw new Error('Password is not correct')
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '3d' })
    user.token = token
    user.verified = true
    user.lastLogin = new Date(Date.now())
    await user.save()

    const authUser = getAuthUser(user)
    return [null, authUser]
  } catch (error) {
    return [error as Error, null]
  }
}

export const getAuthUser = (user: UserModel) => {
  const authUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    gender: user.gender,
    birthday: user.birthday,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: user.token,
    location: user.location,
    picture: user.picture,
    lastLogin: user.lastLogin,
    password: !!user.password
  }
  return authUser
}
