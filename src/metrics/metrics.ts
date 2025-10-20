import client from 'prom-client'
import { Hono } from 'hono'


// collect default metrics (nodejs_process_* etc)
client.collectDefaultMetrics()


export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
})


export function metricsMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    const start = Date.now()
    await next()
    const duration = Date.now() - start
    const route = c.req.url || c.req.path || 'unknown'
    const status = String(c.res.status || 200)
    httpRequestsTotal.inc({ method: c.req.method, route, status })
  }
}


export function metricsRouter() {
  const router = new Hono()
  router.get('/metrics', async (c) => {
    const body = await client.register.metrics()
    return c.text(body, 200, { 'Content-Type': client.register.contentType })
  })
  return router
}