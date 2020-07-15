import { IRouterContext } from 'koa-router'
import { isUrl, isMongoId, isBool } from 'validator'

import { AppId } from '../schema'
import * as mongo from '../mongo'
import { createError, errorName } from '../utils'

interface createBody {
  callbackUrl: string,
  appIds?: AppId[],
  all?: boolean,
}

class WebhookController {
  async add (ctx: IRouterContext) {
    const { callbackUrl, appIds, all } = ctx.request.body as createBody
    if (!callbackUrl) {
      throw createError(errorName.parameterError, 'params', 'not enough params')
    }
    if (!isUrl(callbackUrl)) {
      throw createError(errorName.parameterError, 'callbackUrl', 'callbackUrl is invalid')
    }
    if (appIds && appIds.length > 0 && appIds.some((e) => !isMongoId(e))) {
      throw createError(errorName.parameterError, 'appIds', 'appId must be mongoId')
    }
    if (all !== undefined && !isBool(all)) {
      throw createError(errorName.parameterError, 'all', 'all is invalid')
    }
    const webhook = await mongo.webhook.addWebhook(callbackUrl, appIds, all)
    ctx.body = webhook
  }

  async cancel (ctx: IRouterContext) {
    const { callbackUrl } = ctx.params
    if (!callbackUrl || !isUrl(callbackUrl)) {
      return ctx.body = undefined
    }
    await mongo.webhook.cancelWebhook(callbackUrl)
    return ctx.body = undefined
  }
}

export const webhookController = new WebhookController()
