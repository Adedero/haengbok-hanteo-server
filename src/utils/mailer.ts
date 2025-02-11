import { config } from 'dotenv'
import transporter from '../config/nodemailer.config'

config()

interface MailerOptions {
  to_email: string
  from_email?: string
  subject?: string
  text?: string
  html?: string
}


export default async function sendEmail(
  options: MailerOptions
): Promise<null | Error> {
  try {
    const res = await transporter.sendMail({
      from: {
        name: 'Haengbok Hanteo',
        address: process.env.EMAIL_USER ?? 'info@haengbokhanteo.com'
      },
      to: options.to_email,
      subject: options.subject,
      ...(options.from_email && { replyTo: [options.from_email] }),
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
