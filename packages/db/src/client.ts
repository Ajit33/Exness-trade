import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/exness',
  max: 20,                 // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => console.error('[DB] Unexpected error:', err));

export async function connectDB(): Promise<void> {
  const client = await pool.connect();
  console.log('[DB] Connected to PostgreSQL');
  client.release();
}