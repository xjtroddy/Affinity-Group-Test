import * as mongoose from 'mongoose'

import { AppId, ResponseSchema } from '../schema'
import { getClient } from './init'
import { CollectionName } from './schemas'
import * as moment from 'moment'

function getResponseModel (): mongoose.Model<any> {
  const client = getClient()
  return client[CollectionName.RESPONSE]
}

export async function addRecord (
  appId: AppId,
  statusCode: number,
  rt: number,
) {
  const responseModel = getResponseModel()
  const now = moment()
  const today = moment({year: now.year(), month: now.month(), day: now.date()})
  let ifError = false
  if (!statusCode.toString().startsWith('2')) {
    ifError = true
  }
  const response = await responseModel.findOne({
    appId,
    startTime: today
  }) as ResponseSchema

  if (!response) {
    await responseModel.create({
      _id: mongoose.Types.ObjectId(),
      appId,
      startTime: today,
      records: [{
        rt, statusCode, ifError,
      }]
    })
  } else {
    const newRecords = response.records.concat([{
      rt, statusCode, ifError, time: new Date(),
    }])
    await responseModel.updateOne({
      appId,
      startTime: today
    }, {
      $set: {
        records: newRecords
      }
    })
  }
}
