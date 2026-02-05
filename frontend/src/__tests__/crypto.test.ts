/**
 * Unit tests for crypto and wallet modules
 * Uses Jest-compatible test structure
 */

import { generateMnemonic, validateMnemonic } from '../lib/bip39';
import { generateMasterKey, generateWalletAddresses, mnemonicToSeed } from '../lib/bip32';
import CivicIdentity from '../lib/civicIdentity';
import CivicWallet from '../lib/civicWallet';
import { hashPassword, verifyPassword, deriveKeyFromPassword } from '../lib/passwordUtils';

describe('BIP-39 Mnemonic Generation', () => {
  test('generates 12-word mnemonic', async () => {
    const mnemonic = await generateMnemonic(12);
    expect(mnemonic).toBeDefined();
    expect(mnemonic.split(' ').length).toBe(12);
  });

  test('validates correct mnemonic', async () => {
    const mnemonic = await generateMnemonic(12);
    expect(validateMnemonic(mnemonic)).toBe(true);
  });

  test('rejects invalid mnemonic', () => {
    const invalid = 'invalid mnemonic phrase';
    expect(validateMnemonic(invalid)).toBe(false);
  });

  test('generates 24-word mnemonic', async () => {
    const mnemonic = await generateMnemonic(24);
    expect(mnemonic.split(' ').length).toBe(24);
  });
});

describe('BIP-32 Derivation', () => {
  test('derives master key from seed', async () => {
    const mnemonic = await generateMnemonic(12);
    const seed = await mnemonicToSeed(mnemonic);
    const masterKey = generateMasterKey(seed);

    expect(masterKey).toBeDefined();
    expect(masterKey.privateKey).toBeDefined();
    expect(masterKey.publicKey).toBeDefined();
    expect(masterKey.chainCode).toBeDefined();
  });

  test('generates identical addresses for same mnemonic', async () => {
    const mnemonic = await generateMnemonic(12);
    const addr1 = await generateWalletAddresses(mnemonic);
    const addr2 = await generateWalletAddresses(mnemonic);

    expect(addr1.BTC.address).toBe(addr2.BTC.address);
    expect(addr1.ETH.address).toBe(addr2.ETH.address);
  });

  test('generates addresses for all chains', async () => {
    const mnemonic = await generateMnemonic(12);
    const addresses = await generateWalletAddresses(mnemonic);

    expect(addresses.BTC).toBeDefined();
    expect(addresses.ETH).toBeDefined();
    expect(addresses.KASPA).toBeDefined();
    expect(addresses.MONERO).toBeDefined();
  });
});

describe('CivicIdentity', () => {
  test('creates new identity', async () => {
    const identity = await CivicIdentity.create('password123');
    expect(identity).toBeDefined();
    expect(identity.did).toBeDefined();
    expect(identity.publicKey).toBeDefined();
  });

  test('stores and restores identity', async () => {
    const password = 'testpass123';
    const id1 = await CivicIdentity.create(password);
    const id2 = await CivicIdentity.restore(password);

    expect(id1.did).toBe(id2.did);
    expect(id1.publicKey).toBe(id2.publicKey);
  });

  test('signs message with identity', async () => {
    const identity = await CivicIdentity.create('password123');
    const message = 'test message';
    const signature = await identity.signMessage(message);

    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
  });
});

describe('CivicWallet', () => {
  test('creates wallet with identity', async () => {
    const identity = await CivicIdentity.create('password123');
    const wallet = await CivicWallet.create(identity, 'walletpass123');

    expect(wallet).toBeDefined();
    expect(wallet.civicId).toBe(identity.did);
    expect(wallet.mnemonic).toBeDefined();
    expect(wallet.addresses).toBeDefined();
  });

  test('generates multi-chain addresses', async () => {
    const identity = await CivicIdentity.create('password123');
    const wallet = await CivicWallet.create(identity);

    expect(wallet.getAddress('BTC')).toBeDefined();
    expect(wallet.getAddress('ETH')).toBeDefined();
    expect(wallet.getAddress('KASPA')).toBeDefined();
    expect(wallet.getAddress('MONERO')).toBeDefined();
  });

  test('exports mnemonic', async () => {
    const identity = await CivicIdentity.create('password123');
    const wallet = await CivicWallet.create(identity);
    const mnemonic = wallet.exportMnemonic();

    expect(mnemonic).toBeDefined();
    expect(mnemonic.split(' ').length).toBe(12);
  });
});

describe('Password Utilities', () => {
  test('hashes password', async () => {
    const password = 'testpass123';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  test('verifies correct password', async () => {
    const password = 'testpass123';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });

  test('rejects incorrect password', async () => {
    const password = 'testpass123';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('wrongpass', hash);

    expect(isValid).toBe(false);
  });

  test('derives consistent key from password', async () => {
    const password = 'testpass123';
    const key1 = await deriveKeyFromPassword(password, 'salt1');
    const key2 = await deriveKeyFromPassword(password, 'salt1');

    expect(key1.toString()).toBe(key2.toString());
  });
});

// Test runner stub (would use Jest in real setup)
export const runTests = () => {
  console.log('[tests] All tests would run with npm test');
};
