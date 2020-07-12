export class AppError extends Error {
  code: number

  errorCode: number

  error: string

  message: string

  response: any

  constructor (code: number, errorCode: number, name: string, message: string) {
    super(name)

    this.code = code
    this.errorCode = errorCode
    this.error = name
    this.message = message
  }
}
