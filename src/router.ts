import * as KoaRouter from 'koa-router'

import { appController, incidentController, controller, webhookController } from './controllers'

const apiRouters = new KoaRouter({prefix: '/api'})
const rootRouters = new KoaRouter()

rootRouters.get('/version', controller.version)

apiRouters.post('/apps', appController.create)

apiRouters.put('/apps/:appId(\\w{24})', appController.update)

apiRouters.delete('/apps/:appId(\\w{24})', appController.delete)

apiRouters.get('/incidents', incidentController.list)

apiRouters.post('/webhook', webhookController.add)

apiRouters.delete('/webhook', webhookController.cancel)

export const apiRouter = apiRouters
export const rootRouter = rootRouters
