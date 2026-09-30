import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Singleton: a conexão é aberta uma única vez
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('series.db');
  }
  return dbPromise;
}

export async function runMigrations(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS series (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      temporadas INTEGER NOT NULL,
      nota INTEGER,
      concluida INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}