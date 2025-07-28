// middleware/error-handler.ts

import { Request, Response, NextFunction } from 'express'
import { CustomAPIError } from '../errors/custom-error' // แก้ path ตามจริง

const errorHandlerMiddleware = (
  err: Error | CustomAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as CustomAPIError).statusCode || 500
  const message = err.message || 'Something went wrong'

  return res.status(statusCode).json({
    message: message,
    error: true,
    success: false,
  })
}

export default errorHandlerMiddleware
