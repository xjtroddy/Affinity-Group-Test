import { AppError } from './appError'
import { errorPool, errorName } from './errorPool'

export * from './errorPool'

export function createError (name: errorName, ...messages: string[]) {
  let error = errorPool[name]

  if (!error) {
    error = errorPool.internalServerError
  }
  if (typeof error === 'function') {
    error = error(messages)
  }
  const appError = new AppError(error.code, error.errorCode, error.name, error.message)
  return appError
}
