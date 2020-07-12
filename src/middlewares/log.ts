import { logger } from '../utils'

const pkg = require('../../package.json')

export async function log (ctx: any, next: any) {
  const start = new Date().valueOf()

  try {
    await next()
  } catch (err) {
    process.nextTick(() => logError(ctx, err, start))
    throw err
  }

  // 不打印存活 API 的日志，防止保护进程大量访问而造成的日志爆炸
  if (ctx.path !== '/version') {
    process.nextTick(() => logInfo(ctx, start))
  }
}

function logInfo (ctx: any, startTime: number) {
  const info = {
    requestId: ctx.requestId,
    class: pkg.name,
    ip: ctx.headers['x-real-ip'] || ctx.ip || '-',
    method: ctx.method,
    url: ctx.originalUrl,
    status: ctx.status,
    userId: ctx.state.user && ctx.state.user._id,
    start: startTime,
    time: new Date().valueOf() - startTime,
    userAgent: ctx.get('user-agent'),
    ...ctx.gta,
  }
  if (ctx._matchedRoute) {
    info.route = `${ctx.method} ${ctx._matchedRoute}`
  }
  logger.info(info)
}

function logError (ctx: any, err: any, startTime: number) {

  logger.error({
    class: pkg.name,
    ip: ctx.headers['x-real-ip'] || ctx.ip || '-',
    method: ctx.method,
    url: ctx.originalUrl,
    status: 500,
    userId: ctx.state.user && ctx.state.user._id,
    start: startTime,
    time: new Date().valueOf() - startTime,
    userAgent: ctx.get('user-agent'),
    appErrorMessage: err.message,
    appErrorStack: err.stack,
  })
}
