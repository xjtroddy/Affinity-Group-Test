import * as config from 'config'
import * as mongoose from 'mongoose'
import { ConnectionOptions, Connection } from 'mongoose'
import {
  CollectionName,
  createIncidentSchema,
  createAppSchema,
  createResponseSchema,
  createWebhookSchema,
} from './schemas'
import { logger } from '../utils'

let client: any

export function getClient () {
  return client
}

function bindEvent (conn: Connection) {
  conn.on('error', (err: any) => {
    logger.error({
      msg: 'mongodb connection error',
      err: `message: ${err.message}, stack: ${err.stack}, code: ${err.code}`,
    })
    if (err.code === 'ENETUNREACH') {
      throw err
    }
  })
  conn.on('disconnected', () => {
    logger.error({
      msg: 'mongodb disconnected',
      event: 'mongodb disconnected',
    })
  })
  conn.on('connected', () => {
    logger.info({
      msg: 'mongodb connected',
    })
  })
  conn.on('reconnected', () => {
    logger.info({
      msg: 'mongodb reconnected',
    })
  })

  conn.on('reconnectFailed', () => {
    logger.error({
      msg: 'mongodb reconnect failed',
    })
    throw new Error('mongoose reconnect failed')
  })
}

function initConnect (conf: any) {
  const options: ConnectionOptions = {
    // sets how many times to try reconnecting
    reconnectTries: Number.MAX_VALUE,
    // sets the delay between every retry (milliseconds)
    reconnectInterval: 1000,
    useFindAndModify: false,
  }

  if (conf.authDB) {
    options.authSource = conf.authDB
  }

  options.useNewUrlParser = true
  const conn = mongoose.createConnection(conf.url, options)
  bindEvent(conn)
  return conn
}

export function connect () {
  const conn = initConnect(config.storage.mongo)
  const Models: {[key: string]: any} = {}

  Models[CollectionName.INCIDENT] = conn.model('Incident', createIncidentSchema())
  Models[CollectionName.APP] = conn.model('App', createAppSchema())
  Models[CollectionName.RESPONSE] = conn.model('Response', createResponseSchema())
  Models[CollectionName.WEBHOOK] = conn.model('Webhook', createWebhookSchema())
  client = Models
}




