import { Request, Response, NextFunction } from 'express'

// กำหนด generic type ให้ฟังก์ชัน asyncWrapper
const asyncWrapper = <T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default asyncWrapper
