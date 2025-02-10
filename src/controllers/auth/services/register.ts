import { db } from '../../../database/index'
import { useResponse } from '../../../utils/use-response'
import { Request, Response } from 'express'

const register = async (req: Request, res: Response) => {
  if (!req.body) {
    useResponse(res, 400, 'All fields are required')
    return
  }
  const data = {
    name: req.body.email,
    email: req.body.email,
    birthday: req.body.birthday,
    location: { country: req.body.country.name },
    gender: req.body.gender?.toLowerCase(),
    verified: false,
    role: req.body.role ?? 'USER'
  }

  let user

  try {
    user = await db.User.findOne({ email: data.email }).lean()
    if (!user) {
      user = await db.User.create(data)
      user = user.toObject()
    }
    if (user) {
      if (user.verified) {
        useResponse(res, 200, { user: { ...user, password: !!user.password } })
        return
      }
    }
    useResponse(res, 200, { user: { ...user, password: !!user.password } })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}

export default register
