import { Hono } from 'hono'
import ordersRouter from './routes/orders'
import pino from 'pino'

const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const app = new Hono()

app.get('/', (c) => c.text('Order Service OK'))
app.route('/orders', ordersRouter)

app.onError((err, c) => {
  logger.error(err, 'Unhandled error')
  return c.text('Internal Server Error', 500)
})

export default app