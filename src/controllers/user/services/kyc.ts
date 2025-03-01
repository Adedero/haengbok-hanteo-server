import { type Request, Response } from 'express'
import { useResponse } from '../../../utils/use-response'

export async function submitKyc(req: Request, res: Response) {
  const data = req.body
  if (!data) {
    useResponse(res, 400, 'Please upload a valid ID')
  }

  try {

  } catch {
    
  }
}