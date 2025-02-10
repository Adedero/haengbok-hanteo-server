import { config } from 'dotenv'
import transporter from '../config/nodemailer.config'

config()

interface MailerOptions {
  email: string
  from_email?: string
  subject?: string
  text?: string
  html?: string
}


export default async function sendEmail(
  options: MailerOptions
): Promise<null | Error> {
  const FROM_EMAIL = options.from_email ?? process.env.EMAIL_USER ?? 'Haengbok Hanteo'

  try {
    const res = await transporter.sendMail({
      from: FROM_EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.text ?? '',
      html: options.html ?? ''
    })
    if (res.rejected.length > 0) {
      throw new Error(res.response)
    }
    return null
  } catch (err) {
    return err as Error
  }
}
