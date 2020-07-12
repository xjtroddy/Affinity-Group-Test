import { AppId } from './app'
export type IncidentId = string & { kind?: 'ResponseId' }

export interface IncidentSchema {
  _id: IncidentId,
  appId: AppId,
  startTime: Date,
  endTime: Date,
  duration: number,
  inError: boolean,
}
