import { Hono } from 'hono'
import { CreateOrderUseCase } from '../usecases/createOrder'
import { PgOrderRepository } from '../infra/repositories/orderRepo'
import { migrate } from '../infra/db/postgres'

const router = new Hono()

const repo = new PgOrderRepository()
const createOrder = new CreateOrderUseCase(repo)

// Ensure migrations on start (for dev/demo only)
;(async () => {
  try {
    await migrate()
    // eslint-disable-next-line no-console
    console.log('DB migrated')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Migration failed', e)
  }
})()

router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const order = await createOrder.execute(body)
    return c.json(order, 201)
  } catch (err: any) {
    return c.json({ error: err.message || 'Invalid payload' }, 400)
  }
})

router.get('/:id', async (c) => {
  const { id } = c.req.param()
  const order = await repo.findById(id)
  if (!order) return c.json({ error: 'Not found' }, 404)
  return c.json(order)
})

export default router