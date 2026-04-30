import { pool } from './client';

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // candles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS candles (
        id          BIGSERIAL,
        symbol      VARCHAR(20)  NOT NULL,
        interval    VARCHAR(5)   NOT NULL,
        open        NUMERIC      NOT NULL,
        high        NUMERIC      NOT NULL,
        low         NUMERIC      NOT NULL,
        close       NUMERIC      NOT NULL,
        volume      NUMERIC      NOT NULL,
        timestamp   TIMESTAMPTZ  NOT NULL,
        PRIMARY KEY (id, timestamp)
      );
    `);

    // convert candles to hypertable (TimescaleDB)
    await client.query(`
      SELECT create_hypertable('candles', 'timestamp', if_not_exists => TRUE);
    `);

    // index for fast symbol + time queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_candles_symbol_time
      ON candles (symbol, interval, timestamp DESC);
    `);

    // balance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS balance (
        id          BIGSERIAL PRIMARY KEY,
        asset       VARCHAR(20)  NOT NULL UNIQUE,
        available   NUMERIC      NOT NULL DEFAULT 0,
        locked      NUMERIC      NOT NULL DEFAULT 0,
        updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id          BIGSERIAL PRIMARY KEY,
        symbol      VARCHAR(20)  NOT NULL,
        side        VARCHAR(4)   NOT NULL CHECK (side IN ('BUY', 'SELL')),
        price       NUMERIC      NOT NULL,
        quantity    NUMERIC      NOT NULL,
        status      VARCHAR(10)  NOT NULL DEFAULT 'OPEN' 
                    CHECK (status IN ('OPEN', 'FILLED', 'CANCELLED')),
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // trades table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id          BIGSERIAL PRIMARY KEY,
        order_id    BIGINT       REFERENCES orders(id),
        symbol      VARCHAR(20)  NOT NULL,
        side        VARCHAR(4)   NOT NULL,
        price       NUMERIC      NOT NULL,
        quantity    NUMERIC      NOT NULL,
        pnl         NUMERIC      NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('[DB] Migrations complete');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB] Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}