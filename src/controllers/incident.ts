import { IRouterContext } from 'koa-router'
import { AppId } from '../schema'
import * as mongo from '../mongo'
import { isMongoId } from 'validator'
import { createError, errorName } from '../utils'

class IncidentController {
  async list (ctx: IRouterContext) {
    // const { appId } = ctx.query as { appId: AppId, days: number }
    let { days, appId } = ctx.query as { appId: AppId, days: number }
    if (!appId || !isMongoId(appId)) {
      throw createError(errorName.parameterError, 'appId', 'invalid appId')
    }
    if (!days) {
      days = 30
    }
    const now = Date.now()
    const time = new Date(now - days * 24 * 60 * 60 * 1000)

    await mongo.incident.listIncidentAfterTime(
      appId, time,
    )
  }
}

export const incidentController = new IncidentController()
