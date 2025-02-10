import register from './services/register'
import { sendOtp, verifyOtp } from './services/otp'
import setPassword from './services/password'
import login from './services/login'
import { confirmAccount, resetPassword } from './services/password-recovery'

const AuthController = {
  confirmAccount,
  resetPassword,
  sendOtp,
  setPassword,
  verifyOtp,
  login,
  register
}

export default AuthController
