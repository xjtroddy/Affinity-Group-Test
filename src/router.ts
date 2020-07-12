import * as KoaRouter from 'koa-router'

import { appController, incidentController } from './controllers'

const apiRouter = new KoaRouter({prefix: '/api'})

apiRouter.post('/apps', appController.create)

apiRouter.put('/apps/:appId(\\w{24})', appController.update)

apiRouter.delete('/apps/:appId(\\w{24})', appController.delete)

apiRouter.get('/incidents', incidentController.list)

export default apiRouter
