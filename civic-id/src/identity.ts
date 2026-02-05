import { generateKeyPair, sign, hashData } from './crypto';
import { generateDID, createDIDDocument, CivicDID, DIDDocument } from './did';
import * as Storage from './storage';

/**
 * Civic Identity - Non-custodial, self-sovereign identity
 * Owns cryptographic keys, DID, and recovery mechanisms
 */
export class CivicIdentity {
  public did: string;
  public publicKey: string;
  private privateKey: string;
  public createdAt: number;
  private passphrase: string;

  constructor(
    did: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    createdAt: number = Date.now()
  ) {
    this.did = did;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.passphrase = passphrase;
    this.createdAt = createdAt;
  }

  /**
   * Create a new identity (one-time setup)
   */
  static async create(passphrase: string): Promise<CivicIdentity> {
    // Generate Ed25519 keypair client-side
    const { publicKey, privateKey } = await generateKeyPair();
    
    // Generate DID from public key
    const didObj = generateDID(publicKey);
    
    // Create identity instance
    const identity = new CivicIdentity(
      didObj.did,
      publicKey,
      privateKey,
      passphrase
    );

    // Store encrypted locally
    Storage.storeIdentity(
      {
        civicId: didObj.did,
        publicKey,
        privateKey,
        did: didObj.did,
        didDocument: JSON.stringify(createDIDDocument(didObj)),
        createdAt: identity.createdAt,
      },
      passphrase
    );

    // Cache session
    Storage.cacheSessionKey(hashData(passphrase));

    return identity;
  }

  /**
   * Restore identity from local storage
   */
  static restore(passphrase: string): CivicIdentity | null {
    const stored = Storage.retrieveIdentity(passphrase);
    if (!stored) return null;

    const identity = new CivicIdentity(
      stored.did,
      stored.publicKey,
      stored.privateKey,
      passphrase,
      stored.createdAt
    );

    // Validate stored DID matches expected DID
    if (identity.getDID().did !== stored.did) {
      throw new Error('Stored DID does not match public key - identity corrupted');
    }

    Storage.cacheSessionKey(hashData(passphrase));
    return identity;
  }

  /**
   * Get DID object
   */
  getDID(): CivicDID {
    return {
      did: this.did,
      publicKey: this.publicKey,
      createdAt: this.createdAt,
      method: 'ed25519',
    };
  }

  /**
   * Get public DID Document (safe to share)
   */
  getDIDDocument(): DIDDocument {
    return createDIDDocument(this.getDID());
  }

  /**
   * Sign a message (only works with correct passphrase)
   */
  async signMessage(message: string): Promise<string> {
    return sign(message, this.privateKey);
  }

  /**
   * Get public key (safe to share)
   */
  getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * Logout and clear session (does not delete stored identity)
   */
  logout(): void {
    sessionStorage.removeItem('civicverse:session_key');
  }

  /**
   * Permanently delete identity from device
   * This is IRREVERSIBLE - encourage recovery backup first
   */
  static deleteIdentity(): void {
    Storage.deleteIdentity();
  }

  /**
   * Check if an identity exists on this device
   */
  static exists(): boolean {
    return Storage.hasIdentity();
  }

  /**
   * Get the stored DID without restoring full identity
   */
  static getStoredDID(): string | null {
    return Storage.getStoredDID();
  }
}

export default CivicIdentity;
