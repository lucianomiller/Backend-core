import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/orderdb'

export const pool = new Pool({ connectionString })

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      items JSONB NOT NULL,
      total NUMERIC NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL
    );
  `)
}