import { AppId, Method } from '../schema'
import { ping } from './ping'
import * as mongo from '../mongo'
import { logger } from '../utils'

class PingManagement {
  static instance: PingManagement
  static getInstance () {
    PingManagement.instance = PingManagement.instance ? PingManagement.instance : new this()
    return PingManagement.instance
  }
  private timerMap: Map<AppId, NodeJS.Timeout>
  constructor () {
    this.timerMap = new Map()
  }

  public start (name: string, appId: AppId, url: string, method: keyof typeof Method, frequency: number, body: any, headers: any) {
    const internal = setInterval(() => {
      ping(appId, url, method, body, headers)
    }, frequency)
    this.timerMap.set(appId.toString(), internal)
    logger.info({
      class: 'start timer',
      message: `start timer of ${name}, url is ${method} ${url}, frequency is ${frequency}`
    })
  }

  public stop (appId: AppId) {
    const internal = this.timerMap.get(appId.toString())
    if (internal) {
      clearInterval(internal)
    }
  }

  public async restart(appId: AppId) {
    const internal = this.timerMap.get(appId.toString())
    if (internal) {
      clearInterval(internal)
    }
    const app = await mongo.app.getApp(appId)
    if (app.enabled) {
      this.start(app.name, appId, app.url, app.method, app.frequency, app.body, app.headers)
    }
  }
}

export const pingManagement = PingManagement.getInstance()
