/**
 * Password-Based Key Derivation & Validation
 * Uses PBKDF2 for secure password hashing
 */

/**
 * Derive a 32-byte encryption key from password + salt
 * Uses PBKDF2-SHA256 with 100,000 iterations
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer as any,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: salt as any,
      iterations: 100000,
    },
    keyMaterial,
    256 // 32 bytes = 256 bits
  );

  return new Uint8Array(derivedBits);
}

/**
 * Hash password for verification (also PBKDF2, stores salt with hash)
 * Format: salt_hex:hash_hex
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate 16-byte random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedKey = await deriveKeyFromPassword(password, salt);

  // Store salt + hash together
  const saltHex = hexEncode(salt);
  const hashHex = hexEncode(derivedKey);

  return `${saltHex}:${hashHex}`;
}

/**
 * Verify password against stored hash
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');

  if (!saltHex || !hashHex) {
    console.error('Invalid stored hash format');
    return false;
  }

  const salt = hexDecode(saltHex);
  const storedKeyBytes = hexDecode(hashHex);

  const derivedKey = await deriveKeyFromPassword(password, salt);

  // Constant-time comparison
  return constantTimeCompare(derivedKey, storedKeyBytes);
}

/**
 * Encrypt data using AES-256-GCM with password-derived key
 */
export async function encryptWithPassword(
  plaintext: string,
  password: string
): Promise<string> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive key from password
  const keyBytes = await deriveKeyFromPassword(password, salt);
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Encrypt plaintext
  const encoder = new TextEncoder();
  const plaintextBuffer = encoder.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    plaintextBuffer as BufferSource
  );

  // Return: salt + iv + ciphertext (all hex-encoded)
  const saltHex = hexEncode(salt);
  const ivHex = hexEncode(iv);
  const ciphertextHex = hexEncode(new Uint8Array(ciphertext));

  return `${saltHex}:${ivHex}:${ciphertextHex}`;
}

/**
 * Decrypt data encrypted with encryptWithPassword
 */
export async function decryptWithPassword(
  encrypted: string,
  password: string
): Promise<string> {
  const [saltHex, ivHex, ciphertextHex] = encrypted.split(':');

  if (!saltHex || !ivHex || !ciphertextHex) {
    throw new Error('Invalid encrypted format');
  }

  const salt = hexDecode(saltHex);
  const iv = hexDecode(ivHex);
  const ciphertextBuffer = hexDecode(ciphertextHex);

  // Derive key from password
  const keyBytes = await deriveKeyFromPassword(password, salt);
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // Decrypt
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    ciphertextBuffer as BufferSource
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}

/**
 * Convert Uint8Array to hex string
 */
function hexEncode(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
function hexDecode(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Constant-time comparison to prevent timing attacks
 */
function constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

export default {
  deriveKeyFromPassword,
  hashPassword,
  verifyPassword,
  encryptWithPassword,
  decryptWithPassword,
};
