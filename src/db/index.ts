import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

/**
 * Hosted Postgres providers (Neon, Supabase, Railway, Render…) require TLS.
 * Local development against 127.0.0.1/localhost does not. Detect automatically,
 * and allow an explicit override through DATABASE_SSL=true|false.
 */
function shouldUseSsl(url: string): boolean {
  const override = process.env.DATABASE_SSL;
  if (override === "true") return true;
  if (override === "false") return false;
  try {
    const { hostname, searchParams } = new URL(url);
    if (searchParams.get("sslmode") === "disable") return false;
    return !["localhost", "127.0.0.1", "::1", "postgres", "db"].includes(hostname);
  } catch {
    return false;
  }
}

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
