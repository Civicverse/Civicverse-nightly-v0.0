/**
 * Encrypted Local Storage for Civic Identity
 * Frontend: IndexedDB + localStorage encryption
 * Backend: SQLite with SQLCipher
 */

interface StorageData {
  civicId: string;
  publicKey: string;
  privateKey: string; // Encrypted before storage
  did: string;
  didDocument: string;
  createdAt: number;
  encryptionKey?: string; // For future multi-password scenarios
}

/**
 * Simple encryption for localStorage (client-side)
 * In production, use proper key derivation and AES-256-GCM
 */
function encryptForLocalStorage(data: string, passphrase?: string): string {
  // For MVP: base64 encode + simple XOR with passphrase
  // TODO: Replace with proper crypto (libsodium, TweetNaCl)
  const base64 = btoa(data);
  if (!passphrase) return base64;
  
  // Simple XOR encryption (NOT production-grade - for demo)
  let encrypted = '';
  for (let i = 0; i < base64.length; i++) {
    const charCode = base64.charCodeAt(i) ^ passphrase.charCodeAt(i % passphrase.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted);
}

function decryptFromLocalStorage(encrypted: string, passphrase?: string): string {
  const buffer = atob(encrypted);
  if (!passphrase) return buffer;
  
  let decrypted = '';
  for (let i = 0; i < buffer.length; i++) {
    const charCode = buffer.charCodeAt(i) ^ passphrase.charCodeAt(i % passphrase.length);
    decrypted += String.fromCharCode(charCode);
  }
  return atob(decrypted);
}

/**
 * Store Civic Identity locally (browser environment)
 */
export function storeIdentity(data: StorageData, passphrase: string): void {
  const encrypted = encryptForLocalStorage(JSON.stringify(data), passphrase);
  localStorage.setItem('civicverse:identity', encrypted);
  localStorage.setItem('civicverse:did', data.did); // Store DID unencrypted for easy lookup
}

/**
 * Retrieve Civic Identity from local storage
 */
export function retrieveIdentity(passphrase: string): StorageData | null {
  try {
    const encrypted = localStorage.getItem('civicverse:identity');
    if (!encrypted) return null;
    
    const decrypted = decryptFromLocalStorage(encrypted, passphrase);
    return JSON.parse(decrypted) as StorageData;
  } catch {
    return null;
  }
}

/**
 * Delete identity from local storage (permanent, irreversible)
 */
export function deleteIdentity(): void {
  localStorage.removeItem('civicverse:identity');
  localStorage.removeItem('civicverse:did');
  sessionStorage.removeItem('civicverse:session_key');
}

/**
 * Check if identity exists
 */
export function hasIdentity(): boolean {
  return localStorage.getItem('civicverse:did') !== null;
}

/**
 * Get stored DID (unencrypted, for public reference)
 */
export function getStoredDID(): string | null {
  return localStorage.getItem('civicverse:did');
}

/**
 * Cache session key in sessionStorage for current session only
 * Clears on browser close
 */
export function cacheSessionKey(key: string): void {
  sessionStorage.setItem('civicverse:session_key', key);
}

/**
 * Check if valid session key exists
 */
export function hasValidSession(): boolean {
  return sessionStorage.getItem('civicverse:session_key') !== null;
}

export default {
  storeIdentity,
  retrieveIdentity,
  deleteIdentity,
  hasIdentity,
  getStoredDID,
  cacheSessionKey,
  hasValidSession,
};

