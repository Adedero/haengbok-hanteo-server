import { type NextFunction, Request, Response } from 'express'
import passport from '../config/passport.config'
import { ExpressUser } from '../types'

const authenticate = (role?: 'ADMIN' | 'USER') => {
  const fn = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err: null | Error, user: ExpressUser) => {
      if (err) {
        res.status(401).json({ message: err.message })
        return
      }
      if (!user) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      if (!user.verified) {
        res.status(403).json({ message: 'Account not verified' })
        return
      }
      if (role) {
        if (user.role !== role) {
          res.status(403).json({ message: 'Not allowd' })
          return
        }
      }
      req.user = { ...user }
      next()
    })(req, res, next)
  }
  return fn
}

export default authenticate
