import { Order } from '../../domain/order'
import { pool } from '../db/postgres'

export interface OrderRepository {
  save(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
}

export class PgOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    await pool.query(
      'INSERT INTO orders(id, user_id, items, total, status, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
      [order.id, order.userId, JSON.stringify(order.items), order.total, order.status, order.createdAt]
    )
  }

  async findById(id: string) {
    const res = await pool.query('SELECT * FROM orders WHERE id = $1', [id])
    if (res.rowCount === 0) return null
    const row = res.rows[0]
    return {
      id: row.id,
      userId: row.user_id,
      items: row.items,
      total: Number(row.total),
      status: row.status,
      createdAt: row.created_at.toISOString()
    }
  }
}