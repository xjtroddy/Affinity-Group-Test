import * as request from 'request-promise'
import { Options } from 'request-promise'
import * as mongo from '../mongo'
import { Method, AppId } from '../schema'
import { pingManagement } from './pingManagement'
import * as blls from '../blls'

export async function ping (appId: AppId, url: string, method: keyof typeof Method, body: string, headers: string) {
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
    simple: false,
  } as Options
  let response
  let ifSuccess = true
  try {
    response = await request(options)
    if (!response.statusCode.toString().startsWith('2')) {
      ifSuccess = false
    } else {
      await mongo.incident.recoverIncident(appId)
      await blls.webhook.send(appId, 'recover')
    }
  } catch (e) {
    ifSuccess = false
  }
  const statusCode = response ? response.statusCode : -1
  if (!ifSuccess) {
    await mongo.incident.addIncident(appId, statusCode)
    await blls.webhook.send(appId, 'incident')
  }
  await mongo.response.addRecord(appId, statusCode, Math.floor(response?response.timingPhases.total:0))
}

export async function startAllTimers () {
  const apps = await mongo.app.getAllEnabledApps()
  apps.forEach((app) => {
    pingManagement.start(app.name, app._id, app.url, app.method, app.frequency, app.body, app.headers)
  })
}
