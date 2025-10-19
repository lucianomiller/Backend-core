import { z } from 'zod'
import { Order } from '../domain/order'
import { OrderRepository } from '../infra/repositories/orderRepo'
import crypto from 'crypto'

const createOrderSchema = z.object({
  userId: z.string().min(1),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })),
  total: z.number().nonnegative()
})

export class CreateOrderUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(payload: unknown): Promise<Order> {
    const parsed = createOrderSchema.parse(payload)
    const order: Order = {
      id: crypto.randomUUID(),
      userId: parsed.userId,
      items: parsed.items,
      total: parsed.total,
      status: 'created',
      createdAt: new Date().toISOString()
    }
    await this.repo.save(order)
    return order
  }
}