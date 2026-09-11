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
      + ');'
      + 'CREATE TABLE IF NOT EXISTS chapter_configs ('
      + 'chapter_slug VARCHAR(100) PRIMARY KEY,'
      + 'is_locked BOOLEAN DEFAULT FALSE,'
      + 'unlock_at TIMESTAMP WITH TIME ZONE,'
      + 'custom_gift_url TEXT,'
      + 'custom_promo_code VARCHAR(100),'
      + 'updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
      + ');';

    await client.query(ddl);
  } catch (err) {
    console.error('Failed to init DB schema:', err);
  } finally {
    client.release();
  }
}

// In-Memory store fallback for local development or no-db environments
export const memoryChapterConfigs: Record<string, {
  is_locked: boolean;
  unlock_at: string | null;
  custom_gift_url: string | null;
  custom_promo_code: string | null;
}> = {
  "1-the-drowned-coven": { is_locked: false, unlock_at: null, custom_gift_url: null, custom_promo_code: null },
  "2-the-blind-monastery": { is_locked: true, unlock_at: "2026-10-01T00:00:00Z", custom_gift_url: null, custom_promo_code: null },
  "3-the-whispering-asylum": { is_locked: true, unlock_at: "2026-10-15T00:00:00Z", custom_gift_url: null, custom_promo_code: null }
};

export async function getChapterConfigs() {
  const pool = getDbPool();
  if (pool) {
    try {
      await initDbSchema();
      const res = await pool.query('SELECT * FROM chapter_configs');
      const configs: Record<string, any> = { ...memoryChapterConfigs };
      res.rows.forEach(r => {
        configs[r.chapter_slug] = {
          is_locked: r.is_locked,
          unlock_at: r.unlock_at ? new Date(r.unlock_at).toISOString() : null,
          custom_gift_url: r.custom_gift_url,
          custom_promo_code: r.custom_promo_code,
        };
      });
      return configs;
    } catch (err) {
      console.error('Error reading chapter_configs:', err);
    }
  }
  return memoryChapterConfigs;
}

export async function updateChapterConfig(slug: string, data: {
  is_locked?: boolean;
  unlock_at?: string | null;
  custom_gift_url?: string | null;
  custom_promo_code?: string | null;
}) {
  const pool = getDbPool();
  if (pool) {
    try {
      await initDbSchema();
      await pool.query(
        `INSERT INTO chapter_configs (chapter_slug, is_locked, unlock_at, custom_gift_url, custom_promo_code, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         ON CONFLICT (chapter_slug)
         DO UPDATE SET 
           is_locked = COALESCE($2, chapter_configs.is_locked),
           unlock_at = $3,
           custom_gift_url = $4,
           custom_promo_code = $5,
           updated_at = CURRENT_TIMESTAMP`,
        [slug, data.is_locked ?? false, data.unlock_at || null, data.custom_gift_url || null, data.custom_promo_code || null]
      );
    } catch (err) {
      console.error('Error updating chapter_configs:', err);
    }
  }
  memoryChapterConfigs[slug] = {
    is_locked: data.is_locked ?? memoryChapterConfigs[slug]?.is_locked ?? false,
    unlock_at: data.unlock_at !== undefined ? data.unlock_at : memoryChapterConfigs[slug]?.unlock_at ?? null,
    custom_gift_url: data.custom_gift_url !== undefined ? data.custom_gift_url : memoryChapterConfigs[slug]?.custom_gift_url ?? null,
    custom_promo_code: data.custom_promo_code !== undefined ? data.custom_promo_code : memoryChapterConfigs[slug]?.custom_promo_code ?? null,
  };
  return memoryChapterConfigs[slug];
}
