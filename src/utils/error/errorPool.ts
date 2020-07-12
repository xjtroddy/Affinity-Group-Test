export enum errorName {
  // 400
  parameterError = 'parameterError',

  // 500
  internalServerError = 'internalServerError',
  serviceError = 'serviceError',
  networkError = 'networkError',
}


export interface ErrorPool {
  code: number,
  errorCode: number,
  name: keyof typeof errorName,
  message: string,
}
type errorNames = keyof typeof errorName
type ErrorFunc = (args: any[]) => ErrorPool

export const errorPool: { [name in errorNames]: ErrorPool | ErrorFunc } = {
  // 400
  parameterError: (param: any[]) => {
    return {
      code: 400,
      errorCode: 400000,
      name: errorName.parameterError,
      message: `${param[0]} is error, ${param[1]}`,
    }
  },
  // 500
  internalServerError: {
    code: 500,
    errorCode: 500000,
    name: errorName.internalServerError,
    message: 'internal server error',
  },
  serviceError: (params: any[]) => {
    return {
      code: params[0] || 500,
      errorCode: 500001,
      name: errorName.serviceError,
      message: `Service Error: ${params[1]}`,
    }
  },
  networkError: (params: any[]) => {
    return {
      code: 500,
      errorCode: 500002,
      name: errorName.networkError,
      message: params[0],
    }
  },
}
