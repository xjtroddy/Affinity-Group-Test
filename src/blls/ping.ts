import * as request from 'request-promise'
import { Options } from 'request-promise'
import * as mongo from '../mongo'
import { Method, AppId } from '../schema'
import { pingManagement } from './pingManagement'
import { logger } from '../utils'

export async function ping (appId: AppId, url: string, method: keyof typeof Method, body: any, headers: any) {
  let headersObj = {}
  if (headers) {
    try {
      headersObj = JSON.parse(headers)
    } catch (e) {}
  }
  let bodyObj = {}
  if (body) {
    try {
      bodyObj = JSON.parse(body)
    } catch (e) {}
  }
  const options = {
    time: true,
    url,
    headers: headersObj,
    method,
    body: bodyObj,
    json: true,
    resolveWithFullResponse: true,
    timeout: 5000,
  } as Options
  let response
  try {
    response = await request(options)
  } catch (e) {
    await mongo.incident.addIncident(appId)
    return
  }
  await mongo.response.addRecord(appId, response.statusCode, Math.floor(response.timingPhases.total))
  await mongo.incident.recoverIncident(appId)
}

export async function startAllTimers () {
  const apps = await mongo.app.getAllApp()
  apps.forEach((app) => {
    pingManagement.start(app._id, app.url, app.method, app.frequency, app.body, app.headers)
    logger.info({
      class: 'timer',
      message: `start timer of ${app.name}, frequency is ${app.frequency}`
    })
  })
}
