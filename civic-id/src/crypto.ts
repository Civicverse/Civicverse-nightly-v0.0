import * as ed25519 from '@noble/ed25519';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

/**
 * Generate Ed25519 keypair for cryptographic signing
 * All key generation happens client-side, never transmitted
 */
export async function generateKeyPair(): Promise<{ 
  publicKey: string; 
  privateKey: string 
}> {
  // Generate 32 random bytes for private key seed
  const randomSeed = crypto.getRandomValues(new Uint8Array(32));
  
  // Derive private key from seed
  const privateKey = randomSeed;
  
  // Derive public key from private key
  const publicKey = await ed25519.getPublicKeyAsync(privateKey);
  
  return {
    publicKey: bytesToHex(publicKey),
    privateKey: bytesToHex(privateKey),
  };
}

/**
 * Sign a message with private key
 */
export async function sign(message: string, privateKey: string): Promise<string> {
  const messageBytes = new TextEncoder().encode(message);
  const privateKeyBytes = hexToBytes(privateKey);
  const signature = await ed25519.signAsync(messageBytes, privateKeyBytes);
  return bytesToHex(signature);
}

/**
 * Verify a signature with public key
 */
export async function verify(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(publicKey);
    return await ed25519.verifyAsync(signatureBytes, messageBytes, publicKeyBytes);
  } catch {
    return false;
  }
}

/**
 * Hash data for DID generation and integrity checks
 */
export function hashData(data: string): string {
  const buf = sha256(new TextEncoder().encode(data));
  return bytesToHex(buf);
}

export default {
  generateKeyPair,
  sign,
  verify,
  hashData,
};
