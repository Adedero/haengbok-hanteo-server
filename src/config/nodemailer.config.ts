import { config } from 'dotenv'
import nodemailer from 'nodemailer'
import { isProductionEnv } from '..'
config()

const transporter = nodemailer.createTransport({
  ...(isProductionEnv && { service: process.env.EMAIL_SERVICE }),
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export default transporter
