import { Pool } from 'pg'
import { OutboxEvent } from '../../domain/outboxEvent'

export class PgOutboxRepository {
  constructor(private pool: Pool) {}

  async addEvent(eventType: string, payload: any) {
    await this.pool.query(
      `INSERT INTO outbox_events (event_type, payload) VALUES ($1, $2)`,
      [eventType, payload]
    )
  }

  async getPending(limit = 10): Promise<OutboxEvent[]> {
    const res = await this.pool.query(
      `SELECT * FROM outbox_events WHERE processed = false ORDER BY created_at ASC LIMIT $1`,
      [limit]
    )
    return res.rows
  }

  async markProcessed(id: string) {
    await this.pool.query(`UPDATE outbox_events SET processed = true WHERE id = $1`, [id])
  }
}
