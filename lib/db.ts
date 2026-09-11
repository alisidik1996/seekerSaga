import { Pool } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (process.env.DATABASE_URL) {
    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
    }
    return pool;
  }
  return null;
}
