import { CommonSchema } from './common'
import { AppId } from './app'
export type ResponseId = string & { kind?: 'ResponseId' }

export interface ResponseSchema extends CommonSchema<ResponseId> {
  appId: AppId,
  startTime: Date,
  records: TimeResponseSchema[],
}

export interface TimeResponseSchema {
  rt: number,
  time: Date,
  statusCode: number,
  ifError: boolean,
}
