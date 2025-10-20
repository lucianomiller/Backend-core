import { Pool } from 'pg'
import { createMigrationsTable, getMigrationsHistory, recordMigration } from './migrations/migration-utils'
import * as migration001 from './migrations/001_create_orders_table'
import * as migration002 from './migrations/002_create_outbox_events_table'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/orderdb'

export const pool = new Pool({ connectionString })

const migrations = [
  { name: '001_create_orders_table', up: migration001.up, down: migration001.down },
  { name: '002_create_outbox_events_table', up: migration002.up, down: migration002.down }
]

export async function migrate() {
  await createMigrationsTable(pool)
  const executedMigrations = await getMigrationsHistory(pool)

  for (const migration of migrations) {
    if (!executedMigrations.includes(migration.name)) {
      console.log(`Executing migration: ${migration.name}`)
      await migration.up(pool)
      await recordMigration(pool, migration.name)
      console.log(`Completed migration: ${migration.name}`)
    }
  }
}