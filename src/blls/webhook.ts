import { AppId } from "../schema";
import * as mongo from '../mongo'
import * as request from 'request-promise'

export async function send (appId: AppId, event: 'recover' | 'incident') {
  const webhooks = await mongo.webhook.findWebhooksByAppId(appId)
  webhooks.forEach((w) => {
    request({
      method: 'post',
      url: w.callbackUrl,
      body: {
        event,
      },
      timeout: 5000,
    })
  })
}
