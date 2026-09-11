import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connStr) {
    if (!pool) {
      pool = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
      });
    }
    return pool;
  }
  return null;
}

export async function initDbSchema() {
  const p = getDbPool();
  if (!p) return;

  const client = await p.connect();
  try {
    const ddl = 'CREATE TABLE IF NOT EXISTS seeker_sessions ('
      + 'id SERIAL PRIMARY KEY,'
      + 'session_id VARCHAR(100) UNIQUE NOT NULL,'
      + 'chapter_slug VARCHAR(100) NOT NULL,'
      + 'unlocked_seals JSONB DEFAULT \x27[]\x27::jsonb,'
      + 'is_completed BOOLEAN DEFAULT FALSE,'
      + 'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,'
      + 'updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
      + ');'
      + 'CREATE TABLE IF NOT EXISTS claimed_vouchers ('
      + 'id SERIAL PRIMARY KEY,'
      + 'token VARCHAR(128) UNIQUE NOT NULL,'
      + 'chapter_slug VARCHAR(100) NOT NULL,'
      + 'promo_code VARCHAR(100) NOT NULL,'
      + 'is_redeemed BOOLEAN DEFAULT FALSE,'
      + 'redeemed_by VARCHAR(255),'
      + 'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
      + ');'
      + 'CREATE TABLE IF NOT EXISTS lore_archives ('
      + 'id SERIAL PRIMARY KEY,'
      + 'chapter_slug VARCHAR(100) NOT NULL,'
      + 'category VARCHAR(50) NOT NULL,'
      + 'title VARCHAR(255) NOT NULL,'
      + 'content TEXT NOT NULL,'
      + 'created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
      + ');';

    await client.query(ddl);
  } catch (err) {
    console.error('Failed to init DB schema:', err);
  } finally {
    client.release();
  }
}
