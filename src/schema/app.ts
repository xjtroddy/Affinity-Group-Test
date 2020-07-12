import { CommonSchema } from './common'
export type AppId = string & { kind?: 'AppId' }

export enum Method {
  get = 'get',
  post = 'post',
  delete = 'delete',
  put = 'put',
}

export interface AppSchema extends CommonSchema<AppId> {
  name: string,
  frequency: number,
  enabled: boolean,
  method: Method,
  url: string,
  body?: { [ propName: string ] : string },
  headers?: { [ propName: string ] : string },
}
