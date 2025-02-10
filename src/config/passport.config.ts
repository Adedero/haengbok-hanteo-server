import dotenv from 'dotenv'
import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { db } from '../database'
import { ExpressUser } from '../types'
dotenv.config()

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'jwt-secret'
}

type Callback = (error: Error | null, user: ExpressUser | boolean) => void

passport.use(
  new Strategy(jwtOptions, async (payload: { id: string }, done: Callback) => {
    try {
      const user = await db.User.findById(payload.id).lean()
      if (!user) return done(null, false)
      const updatedUser: ExpressUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        role: user.role,
        token: user.token
      }
      return done(null, updatedUser)
    } catch (error) {
      return done(error as Error, false)
    }
  })
)

export default passport
