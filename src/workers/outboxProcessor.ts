import amqp from 'amqplib'
import { pool } from '../infra/db/postgres'
import { PgOutboxRepository } from '../infra/repositories/outboxRepo'

const repo = new PgOutboxRepository(pool)

export async function startOutboxProcessor() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672')
  const channel = await connection.createChannel()
  await channel.assertExchange('orders', 'topic', { durable: true })

  console.log('Outbox Processor started 🚀')

  setInterval(async () => {
    const pending = await repo.getPending(10)
    for (const event of pending) {
      try {
        await channel.publish('orders', event.event_type, Buffer.from(JSON.stringify(event.payload)))
        await repo.markProcessed(event.id)
        console.log('✅ Sent event', event.event_type)
      } catch (err) {
        console.error('❌ Error sending event', err)
      }
    }
  }, 5000)
}

startOutboxProcessor().catch(console.error)
