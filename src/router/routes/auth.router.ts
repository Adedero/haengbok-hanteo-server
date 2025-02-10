import AuthController from '../../controllers/auth/auth.controller'
import { Router } from 'express'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/account/confirm', AuthController.confirmAccount)
router.post('/account/otp', AuthController.sendOtp)
router.post('/account/verify', AuthController.verifyOtp)
router.post('/account/set-password', AuthController.setPassword)
router.put('/account/reset-password', AuthController.resetPassword)
/* router.post('/login/:email?', AuthController.login)

router.post(
  '/account/verification-email/:id/:email',
  AuthController.sendVerificationMail
)
router.post('/account/change-email/:id/:email', AuthController.changeEmail)
router.post('/account/verify', AuthController.verifyAccount)
router.post('/account/pin-setup/:id', AuthController.pinSetup) */

export default router
