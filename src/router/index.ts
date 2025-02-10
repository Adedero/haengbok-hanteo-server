import { Express } from 'express'
import pageRouter from './routes/pages.router'
import authRouter from './routes/auth.router'
import userRouter from './routes/user.router'
import apiRouter from './routes/api.router'
import authenticate from '../middleware/authenticate'

export default function useRouter(app: Express) {
  app.use('/', pageRouter)
  app.use('/auth', authRouter)
  app.use('/user', authenticate('USER'), userRouter)
  app.use('/api', apiRouter)
}
