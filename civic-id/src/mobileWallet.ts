import nacl from "tweetnacl";
import { encodeUTF8, decodeUTF8 } from "tweetnacl-util";

// Simple Wallet interface for Civic ID
export interface WalletKeys {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

// Generate a new wallet
export function generateWallet(): WalletKeys {
  const keyPair = nacl.sign.keyPair();
  return keyPair;
}

// Export wallet to string for mobile/hardware storage
export function exportWallet(wallet: WalletKeys): string {
  const data = {
    publicKey: Array.from(wallet.publicKey),
    secretKey: Array.from(wallet.secretKey),
  };
  return JSON.stringify(data);
}

// Import wallet from string
export function importWallet(data: string): WalletKeys {
  const parsed = JSON.parse(data);
  return {
    publicKey: new Uint8Array(parsed.publicKey),
    secretKey: new Uint8Array(parsed.secretKey),
  };
}

// Sign a message (transaction)
export function signTransaction(wallet: WalletKeys, message: string): Uint8Array {
  return nacl.sign.detached(decodeUTF8(message), wallet.secretKey);
}

// Verify a signed message
export function verifyTransaction(wallet: WalletKeys, message: string, signature: Uint8Array): boolean {
  return nacl.sign.detached.verify(decodeUTF8(message), signature, wallet.publicKey);
}
