import { PgOrderRepository } from '../infra/repositories/orderRepo'
import { CreateOrderUseCase } from '../usecases/createOrder'

class InMemoryRepo implements PgOrderRepository {
  private store = new Map<string, any>()
  async save(order: any) {
    this.store.set(order.id, order)
  }
  async findById(id: string) {
    return this.store.get(id) || null
  }
}

test('create order success', async () => {
  const repo = new InMemoryRepo() as any
  const uc = new CreateOrderUseCase(repo)
  const payload = { userId: 'u1', items: [{ productId: 'p1', quantity: 2 }], total: 100 }
  const order = await uc.execute(payload)
  expect(order.id).toBeDefined()
  expect(order.userId).toBe('u1')
})