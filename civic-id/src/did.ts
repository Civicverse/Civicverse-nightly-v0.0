import { hashData } from './crypto';

/**
 * Civic DID (Decentralized Identifier)
 * Deterministically derived from public key - no central registry required
 * Format: did:civic:HASH_OF_PUBKEY
 */
export interface CivicDID {
  did: string;
  publicKey: string;
  createdAt: number;
  method: 'ed25519';
}

/**
 * Generate a deterministic Civic DID from public key
 * The DID is a hash of the public key, making it globally unique and self-sovereign
 */
export function generateDID(publicKey: string): CivicDID {
  // DID is deterministic: same public key always generates same DID
  const didHash = hashData(publicKey).slice(0, 32); // Use first 32 hex chars
  
  return {
    did: `did:civic:${didHash}`,
    publicKey,
    createdAt: Date.now(),
    method: 'ed25519',
  };
}

/**
 * DID Document - minimal verifiable proof of identity
 * Can be published without revealing private key
 */
export interface DIDDocument {
  '@context': 'https://w3c-ccg.github.io/did-core/';
  id: string;
  publicKey: Array<{
    id: string;
    type: string;
    publicKeyHex: string;
  }>;
  authentication: string[];
  proof?: {
    type: string;
    created: string;
    signatureValue: string;
  };
}

/**
 * Create a DID Document from a Civic DID
 * This is what gets published/shared - never includes private key
 */
export function createDIDDocument(did: CivicDID): DIDDocument {
  return {
    '@context': 'https://w3c-ccg.github.io/did-core/',
    id: did.did,
    publicKey: [
      {
        id: `${did.did}#keys-1`,
        type: 'Ed25519VerificationKey2020',
        publicKeyHex: did.publicKey,
      },
    ],
    authentication: [`${did.did}#keys-1`],
  };
}

/**
 * Parse a DID string to validate format
 */
export function parseDID(did: string): { method: string; id: string } | null {
  const match = did.match(/^did:([a-z]+):(.+)$/);
  if (!match) return null;
  return { method: match[1], id: match[2] };
}

export default {
  generateDID,
  createDIDDocument,
  parseDID,
};
