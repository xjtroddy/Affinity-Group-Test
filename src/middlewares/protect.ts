import { AppError } from '../utils/error/appError'

export async function protectApp (ctx: any, next: any) {
  try {
    await next()
  } catch (err) {
    if (err instanceof AppError) {
      ctx.status = err.code || 500
      ctx.body = {
        code: err.code,
        errorCode: err.errorCode,
        error: err.error,
        message: err.message,
        response: err.response,
      }
    } else {
      ctx.status = 500
      ctx.body = String(`message: ${err.message}.  stack: ${err.stack}`)
    }
  }
}
