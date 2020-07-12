import { AppId, Method } from '../schema'
import { ping } from './ping'
import * as mongo from '../mongo'

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

  public start (appId: AppId, url: string, method: keyof typeof Method, frequency: number, body: any, headers: any) {
    const internal = setInterval(() => {
      ping(appId, url, method, body, headers)
    }, frequency)
    this.timerMap.set(appId.toString(), internal)
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
      this.start(appId, app.url, app.method, app.frequency, app.body, app.headers)
    }
  }
}

export const pingManagement = PingManagement.getInstance()
