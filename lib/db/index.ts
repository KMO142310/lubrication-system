import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Creates local sqlite database file if not exists
const sqlite = new Database('aisa.db');

export const db = drizzle(sqlite, { schema });

// Helper to check if DB is initialized (simple check)
export function isDbInitialized() {
    const result = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    return !!result;
}
