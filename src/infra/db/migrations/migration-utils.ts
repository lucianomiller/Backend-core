import { Pool } from 'pg'

export async function createMigrationsTable(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

export async function getMigrationsHistory(pool: Pool): Promise<string[]> {
  const result = await pool.query('SELECT name FROM migrations ORDER BY id')
  return result.rows.map(row => row.name)
}

export async function recordMigration(pool: Pool, migrationName: string): Promise<void> {
  await pool.query('INSERT INTO migrations (name) VALUES ($1)', [migrationName])
}