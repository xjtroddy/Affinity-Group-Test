import * as mongoose from 'mongoose'

import { AppId, AppSchema, Method } from '../schema'
import { getClient } from './init'
import { CollectionName } from './schemas'

function getAppModel (): mongoose.Model<any> {
  const client = getClient()
  return client[CollectionName.APP]
}

export async function createApp (
  name: string,
  frequency: number,
  url: string,
  method: keyof typeof Method,
  body?: any,
  headers?: any,
) {
  const appModel = getAppModel()
  return await appModel.create({
    _id: mongoose.Types.ObjectId(),
    name,
    frequency,
    url,
    method,
    body,
    headers,
  })
}

export async function getApp (appId: AppId) {
  const appModel = getAppModel()
  return await appModel.findOne({
    _id: appId
  }).lean() as AppSchema
}

export async function deleteApp (appId: AppId) {
  const appModel = getAppModel()
  return await appModel.remove({
    _id: appId
  })
}

export async function getAllEnabledApps () {
  const appModel = getAppModel()
  return await appModel.find({
    enabled: true,
  }).lean() as AppSchema[]
}

export async function updateApp (
  appId: AppId,
  frequency?: number,
  enabled?: boolean,
  url?: string,
  method?: keyof typeof Method,
  body?: any,
  headers?: any,
) {
  const appModel = getAppModel()
  const updateBody: any = {}
  if (frequency !== undefined) {
    updateBody.frequency = frequency
  }
  if (enabled !== undefined) {
    updateBody.enabled = enabled
  }
  if (url !== undefined) {
    updateBody.url = url
  }
  if (method !== undefined) {
    updateBody.method = method
  }
  if (body !== undefined) {
    updateBody.body = body
  }
  if (headers !== undefined) {
    updateBody.headers = headers
  }
  return await appModel.findOneAndUpdate({
    _id: appId
  }, {
    $set: updateBody
  }, {
    new: true,
  })
}

