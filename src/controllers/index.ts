import { IRouterContext } from 'koa-router'

export * from './app'
export * from './incident'
export * from './webhook'

class Controller {
  async version (ctx: IRouterContext) {
    return ctx.body = Object.assign({
      env: process.env.NODE_ENV,
      buildId: process.env.BUILD_ID,
      author: process.env.BUILD_AUTHOR,
      name: 'affinity-group',
    })
  }
}

export const controller = new Controller()
