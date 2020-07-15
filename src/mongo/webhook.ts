import * as mongoose from 'mongoose'

import { AppId, WebhookSchema } from '../schema'
import { getClient } from './init'
import { CollectionName } from './schemas'

function getWebhookModel (): mongoose.Model<any> {
  const client = getClient()
  return client[CollectionName.WEBHOOK]
}

export async function addWebhook (
  callbackUrl: string,
  appIds?: AppId[],
  all?: boolean,
) {
  const webhookModel = getWebhookModel()
  return await webhookModel.findOneAndUpdate({
    callbackUrl,
  }, {
    appIds, all
  }, {
    new: true,
    setDefaultsOnInsert: true,
    upsert: true
  })
}

export async function cancelWebhook (callbackUrl: string) {
  const webhookModel = getWebhookModel()
  return await webhookModel.remove({
    callbackUrl
  })
}

export async function findWebhooksByAppId (appId: AppId) {
  const webhookModel = getWebhookModel()
  return await webhookModel.find({
    $or: [
      { appIds: appId },
      { all: true }
    ]
  }).lean() as WebhookSchema[]
}
