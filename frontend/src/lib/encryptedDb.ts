import initSqlJs from 'sql.js';
import { encryptWithPassword, decryptWithPassword } from './passwordUtils';

const STORAGE_KEY = 'civicverse:encdb';

export type SqlJsDatabase = any;

async function b64ToUint8Array(b64: string): Promise<Uint8Array> {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function uint8ArrayToB64(bytes: Uint8Array): Promise<string> {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export async function openEncryptedDb(password?: string) {
  const SQL = await initSqlJs();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    if (stored.startsWith('ENCRYPTED:')) {
      if (!password) throw new Error('Password required to open encrypted DB');
      const enc = stored.substring('ENCRYPTED:'.length);
      const decrypted = await decryptWithPassword(enc, password);
      const bytes = await b64ToUint8Array(decrypted);
      const db = new SQL.Database(bytes);
      return createHandle(db, password);
    } else {
      // legacy base64-stored DB
      const bytes = await b64ToUint8Array(stored);
      const db = new SQL.Database(bytes);
      return createHandle(db, password);
    }
  }

  // No DB found; create new
  const db = new SQL.Database();
  // Simple key-value table for app usage
  db.run('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v BLOB);');
  await saveDb(db, password);
  return createHandle(db, password);
}

function createHandle(db: SqlJsDatabase, password?: string) {
  return {
    db,
    run: (sql: string, params?: any[]) => db.run(sql, params),
    exec: (sql: string) => db.exec(sql),
    prepare: (sql: string) => db.prepare(sql),
    get: (key: string) => {
      const stmt = db.prepare('SELECT v FROM kv WHERE k = ?');
      stmt.bind([key]);
      if (!stmt.step()) return null;
      const row = stmt.getAsObject();
      stmt.free();
      return row.v;
    },
    set: async (key: string, value: string) => {
      const stmt = db.prepare('INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)');
      stmt.bind([key, value]);
      stmt.step();
      stmt.free();
      await saveDb(db, password);
    },
    save: async () => saveDb(db, password),
    close: () => db.close(),
  };
}

async function saveDb(db: SqlJsDatabase, password?: string) {
  const data = db.export();
  const b64 = await uint8ArrayToB64(data);
  if (password) {
    const enc = await encryptWithPassword(b64, password);
    localStorage.setItem(STORAGE_KEY, `ENCRYPTED:${enc}`);
  } else {
    localStorage.setItem(STORAGE_KEY, b64);
  }
}

export async function deleteDb() {
  localStorage.removeItem(STORAGE_KEY);
}
