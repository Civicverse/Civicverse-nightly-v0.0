/**
 * Civicverse Civic ID - Non-Custodial Identity System
 * 
 * Core exports for identity, crypto, and storage
 */

export { CivicIdentity } from './identity';
export { generateDID, createDIDDocument, parseDID } from './did';
export { generateKeyPair, sign, verify, hashData } from './crypto';
export { 
  storeIdentity, 
  retrieveIdentity, 
  deleteIdentity, 
  hasIdentity, 
  getStoredDID,
  cacheSessionKey,
  hasValidSession
} from './storage';

export type { CivicDID, DIDDocument } from './did';

