import { Request, Response } from 'express'
import { useResponse } from '../../../utils/use-response'
import { db } from '../../../database'
import {
  generateRandomPin,
  isPinExpired,
  setPinExpiryDate
} from '../../../utils/pin-generator'
import sendEmail from '../../../utils/mailer'
import { ObjectId } from 'mongoose'

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.query
  if (!email) {
    useResponse(res, 400, 'Email is required')
    return
  }
  try {
    const user = await db.User.findOne({ email }).lean()
    if (!user) {
      useResponse(res, 400, 'No user with this email was found')
      return
    }
    /* if (user.verified) {
      useResponse(res, 200, {
        verified: user.verified,
        hasPassword: !!user.password
      })
      return
    } */
    const EXPIRY_TIME = '1 hour'
    let otp = await db.OTP.findOne({ user: user._id })
    if (!otp) {
      otp = await db.OTP.create({
        user: user._id,
        value: generateRandomPin(6),
        expires: setPinExpiryDate(EXPIRY_TIME)
      })
    }
    if (isPinExpired(otp.expiresAt)) {
      otp.value = parseInt(generateRandomPin(6))
      otp.expiresAt = setPinExpiryDate(EXPIRY_TIME)
      await otp.save()
    }
    const text = `Your secure OTP: ${otp.value}. Note that this password expires in ${EXPIRY_TIME}`

    const mailError = await sendEmail({
      to_email: user.email,
      subject: 'Haengbok-Hanteo Account Verification',
      text
    })

    if (mailError) {
      useResponse(res, 500, 'Could not send email. Try again later.')
      return
    }
    useResponse(res, 200, {
      message: 'Verification email sent successfully',
      verified: false
    })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, password } = req.query
  if (!email || !password) {
    useResponse(res, 400, 'Email and password are required')
    return
  }
  if (password.length !== 6) {
    useResponse(res, 400, 'Invalid password')
    return
  }

  try {
    const user = await db.User.findOne({ email })
    if (!user) {
      useResponse(
        res,
        400,
        'This account does not exits or may have been deleted'
      )
      return
    }
    const message = 'Account verification completed'

    if (user.verified) {
      await db.OTP.deleteOne({ user: user._id })
      await sendNotification(user._id as string)
      useResponse(res, 200, {
        message,
        verified: user.verified,
        hasPassword: !!user.password
      })
      return
    }
    const validatedOtp = await validateOtp(
      user._id as ObjectId,
      password as string
    )
    if (!validatedOtp.valid) {
      useResponse(res, 400, validatedOtp.message)
      return
    }
    user.verified = true
    await Promise.all([
      user.save(),
      sendNotification(user._id as string)
    ])

    useResponse(res, 200, {
      message,
      verified: user.verified,
      hasPassword: !!user.password
    })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}

interface OtpValidationReturnType {
  value: number | string
  valid: boolean
  message: string
}

async function validateOtp(
  userId: ObjectId | string,
  password: string | number
): Promise<OtpValidationReturnType> {
  const otp = parseInt(password as string)
  if (isNaN(otp)) {
    return {
      value: password,
      valid: false,
      message: 'The OTP provided is invalid'
    }
  }
  const existingOtp = await db.OTP.findOne({ user: userId })
  if (!existingOtp) {
    return {
      value: otp,
      valid: false,
      message: 'The OTP provided has expired. Try generating a new one.'
    }
  }

  if (isPinExpired(existingOtp.expiresAt)) {
    await existingOtp.deleteOne()
    return {
      value: otp,
      valid: false,
      message: 'The OTP has expired. Try generating a new one.'
    }
  }

  const isOtpCorrect = otp === existingOtp.value
  if (!isOtpCorrect) {
    return {
      value: otp,
      valid: false,
      message:
        'The OTP provided is incorrect. Check your email address and try again.'
    }
  }

  await existingOtp.deleteOne()
  return {
    value: otp,
    valid: true,
    message: 'OTP is valid and correct'
  }
}


async function sendNotification (userId: string) {
  try {
    await db.Notification.create({
      user: userId,
      title: 'Account Verification',
      message: 'Your account has been verified. You can set up your password if you haven\'t already',
      isRead: false
    })
  } catch (error) {
    throw error as Error
  }
}