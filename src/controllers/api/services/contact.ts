import { Request, Response } from "express";
import { useResponse } from "../../../utils/use-response";
import sendEmail from "../../../utils/mailer";
import { helpEmail } from "../../../templates/email";


export default async function contactCustomerCare (req: Request, res: Response) {
  if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
    useResponse(res, 400, 'Name, email, and message are required')
    return
  }
  const { name, email, subject, message } = req.body as { name: string; email: string; subject?: string; message: string }

  try {
    const error = await sendEmail({
      to_email: process.env.EMAIL ?? 'nathan44wilson@gmail.com',
      from_email: email,
      subject,
      html: helpEmail({ name, email, message, subject })
    })
    if (error) {
      useResponse(res, 400, 'Failed to send email. Try again later')
      return
    }
    useResponse(res, 200, { success: true })
  } catch (error) {
    useResponse(res, 500, (error as Error).message)
  }
}