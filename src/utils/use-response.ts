import { Response } from 'express'

export const useResponse = (
  res: Response,
  status: number,
  message?: string | Record<string, unknown>
) => {
  let data: Record<string, unknown> = {}
  if (!message)
    data.message = "And we're working on it.\nPlease, try again later."
  else if (typeof message === 'string') data.message = message
  else data = message
  res.status(status).json(data)
}
