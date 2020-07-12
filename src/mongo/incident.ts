import * as mongoose from 'mongoose'

import { AppId, IncidentSchema } from '../schema'
import { getClient } from './init'
import { CollectionName } from './schemas'

function getIncidentModel (): mongoose.Model<any> {
  const client = getClient()
  return client[CollectionName.INCIDENT]
}

export async function addIncident (
  appId: AppId,
) {
  const incidentModel = getIncidentModel()
  const alreadyError = await incidentModel.findOne({
    appId,
    inError: true,
    $exists: { endTime: false },
  })
  if (alreadyError) {
    return
  }
  await incidentModel.create({
    appId,
  })
}

export async function recoverIncident (appId: AppId) {
  const incidentModel = getIncidentModel()
  const alreadyError = await incidentModel.findOne({
    appId, inError: true,
  }) as IncidentSchema
  if (alreadyError) {
    const now = new Date()
    const duration = now.getTime() - alreadyError.startTime.getTime()
    await incidentModel.updateOne({
      appId,
    }, {
      $set: {
        endTime: now,
        duration,
      }
    })
  }
}

export async function listIncidentAfterTime (appId: AppId, time: Date) {
  const incidentModel = getIncidentModel()
  const incidents = await incidentModel.find({
    appId,
    startTime: {$gte: time}
  }).lean()
  return incidents
}
