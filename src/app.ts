import * as Koa from 'koa'
import * as bodyparser from 'koa-bodyparser'

import { log, protectApp } from './middlewares'
import * as mongo from './mongo'
import { apiRouter, rootRouter } from './router'
import { logger } from './utils'
import * as config from 'config'
import { startAllTimers } from './blls/ping'

const pkg = require('../package.json')
const port = process.env.APP_PORT || config.app.port || 3000

const startServer = async () => {
  logger.info({
    class: 'start',
    message: 'Connecting mongo',
  })
  mongo.connect()

  const app = new Koa()
  app.use(protectApp)
  app.use(log)
  app.use(bodyparser())
  app.use(apiRouter.routes())
  app.use(rootRouter.routes())
  app.listen(port, () => {
    logger.info({
      class: 'start',
      name: pkg.name,
      version: pkg.version,
      port,
    })
  })
}

(async () => {
  await startServer()
  await startAllTimers()
})().catch((error) => {
  logger.error(error)
})
