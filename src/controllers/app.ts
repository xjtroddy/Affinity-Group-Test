import { IRouterContext } from 'koa-router'
import { isBool, isMongoId, isUrl } from 'validator'

import * as mongo from '../mongo'
import { createError, errorName } from '../utils'
import { Method } from '../schema'
import { pingManagement } from '../blls/pingManagement'

interface createBody {
  name: string,
  frequency: number,
  url: string,
  method: keyof typeof Method,
  body?: any,
  headers?: any,
}

interface updateBody {
  name?: string,
  frequency?: number,
  enabled?: boolean,
  url?: string,
  method?: keyof typeof Method,
  body?: any,
  headers?: any,
}

class AppController {
  async create (ctx: IRouterContext) {
    const { name, frequency, url, method, body, headers } = ctx.request.body as createBody
    if (!name || !frequency || !url || !method) {
      throw createError(errorName.parameterError, 'params', 'not enough params')
    }
    if (name.length > 40) {
      throw createError(errorName.parameterError, 'name', 'name length must below 40')
    }
    if (frequency <= 0) {
      throw createError(errorName.parameterError, 'frequency', 'frequency is invalid')
    }
    const app = await mongo.app.createApp(name, frequency, url, method, body, headers)
    await pingManagement.start(app._id, url, method, frequency, body, headers)
    ctx.body = app
  }

  async update (ctx: IRouterContext) {
    const { appId } = ctx.params
    if (!isMongoId(appId)) {
      throw createError(errorName.parameterError, 'appId', 'invalid appId')
    }
    const { frequency, enabled, url, method, body, headers } = ctx.request.body as updateBody
    if (!frequency && enabled === undefined && !url && !method && !body && !headers) {
      throw createError(errorName.parameterError, 'params', 'not enough params')
    } else if (frequency !== undefined && frequency <= 0) {
      throw createError(errorName.parameterError, 'frequency', 'frequency is invalid')
    } else if (enabled !== undefined && !isBool(enabled)) {
      throw createError(errorName.parameterError, 'enabled', 'enabled must be bool')
    } else if (url !== undefined && !isUrl(url)) {
      throw createError(errorName.parameterError, 'url', 'url is invalid')
    }
    const app = await mongo.app.updateApp(appId, frequency, enabled, url, method, body, headers)
    await pingManagement.restart(appId)
    ctx.body = app
  }

  async delete (ctx: IRouterContext) {
    const { appId } = ctx.params
    if (!appId || !isMongoId(appId)) {
      throw createError(errorName.parameterError, 'appId', 'invalid appId')
    }
    await pingManagement.stop(appId)
    await mongo.app.deleteApp(appId)
    ctx.body = undefined
  }
}

export const appController = new AppController()
