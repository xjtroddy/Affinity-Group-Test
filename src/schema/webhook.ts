import { CommonSchema } from './common'
export type WebhookId = string & { kind?: 'WebhookId' }

export interface WebhookSchema extends CommonSchema<WebhookId> {
  callbackUrl: string,
  appIds: string[],
  all: boolean,
}

