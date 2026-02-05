/**
 * Encrypted IndexedDB Storage Wrapper
 * Provides a persistent, large-capacity encrypted storage backend
 * Fallback to localStorage for smaller data
 */

import { encryptWithPassword, decryptWithPassword } from './passwordUtils';

const DB_NAME = 'civicverse-encrypted-store';
const STORE_NAME = 'encrypted-data';
const DB_VERSION = 1;

export interface IndexedDbHandle {
  set: (key: string, value: unknown, password?: string) => Promise<void>;
  get: (key: string, password?: string) => Promise<unknown | null>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  close: () => void;
}

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB connection
 */
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Store encrypted data in IndexedDB
 */
async function set(key: string, value: unknown, password?: string): Promise<void> {
  try {
    // Serialize value
    const serialized = JSON.stringify(value);
    let dataToStore: string;

    if (password) {
      // Encrypt with password
      dataToStore = `ENCRYPTED:${await encryptWithPassword(serialized, password)}`;
    } else {
      // Store plain (not recommended for sensitive data)
      dataToStore = serialized;
    }

    const database = await openDb();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const putRequest = store.put({ key, data: dataToStore, timestamp: Date.now() });
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(new Error(`Failed to store key: ${key}`));
    });
  } catch (err) {
    console.error('IndexedDB set error:', err);
    throw err;
  }
}

/**
 * Retrieve and decrypt data from IndexedDB
 */
async function get(key: string, password?: string): Promise<unknown | null> {
  try {
    const database = await openDb();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(key);

      getRequest.onsuccess = async () => {
        const result = getRequest.result;
        if (!result) {
          resolve(null);
          return;
        }

        try {
          let decrypted = result.data;

          if (decrypted.startsWith('ENCRYPTED:')) {
            if (!password) {
              throw new Error('Password required to decrypt data');
            }
            const encryptedPart = decrypted.substring('ENCRYPTED:'.length);
            const decryptedStr = await decryptWithPassword(encryptedPart, password);
            decrypted = decryptedStr;
          }

          resolve(JSON.parse(decrypted));
        } catch (err) {
          reject(err);
        }
      };

      getRequest.onerror = () => reject(new Error(`Failed to retrieve key: ${key}`));
    });
  } catch (err) {
    console.error('IndexedDB get error:', err);
    throw err;
  }
}

/**
 * Delete a key from IndexedDB
 */
async function deleteKey(key: string): Promise<void> {
  try {
    const database = await openDb();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const deleteRequest = store.delete(key);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(new Error(`Failed to delete key: ${key}`));
    });
  } catch (err) {
    console.error('IndexedDB delete error:', err);
    throw err;
  }
}

/**
 * Clear all data from IndexedDB
 */
async function clear(): Promise<void> {
  try {
    const database = await openDb();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(new Error('Failed to clear IndexedDB'));
    });
  } catch (err) {
    console.error('IndexedDB clear error:', err);
    throw err;
  }
}

/**
 * Close IndexedDB connection
 */
function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export async function createIndexedDbStore(): Promise<IndexedDbHandle> {
  // Test IndexedDB availability
  if (!window.indexedDB) {
    throw new Error('IndexedDB not supported in this browser');
  }

  return {
    set,
    get,
    delete: deleteKey,
    clear,
    close: closeDb,
  };
}

export default {
  createIndexedDbStore,
};
