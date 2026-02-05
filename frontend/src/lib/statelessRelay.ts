/**
 * Phase 4: Stateless Server Relay & Transaction Broadcasting
 * 
 * Overview:
 * - Sign transactions on client with private key
 * - Submit signed transactions to stateless relay server
 * - Relay broadcasts to blockchain networks (Bitcoin, Ethereum, etc.)
 * - Server never holds private keys; purely a transaction relay
 * - Multi-chain support (BTC, ETH, KASPA, MONERO)
 */

export interface Transaction {
  chainType: 'BTC' | 'ETH' | 'KASPA' | 'MONERO';
  from: string;
  to: string;
  amount: string; // in native units (satoshis, wei, etc.)
  fee?: string;
  nonce?: number;
  data?: string; // for smart contracts (ETH only)
  timestamp: number;
}

export interface SignedTransaction {
  transaction: Transaction;
  signature: string; // signed with private key
  publicKey: string;
  signatureAlgorithm: 'ed25519' | 'secp256k1';
}

export interface BroadcastResult {
  txid: string;
  chainType: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  timestamp: number;
  blockNumber?: number;
  blockHash?: string;
  error?: string;
}

/**
 * Stateless relay client
 */
export class StatelessRelay {
  private relayUrl: string;

  constructor(relayUrl: string = 'http://localhost:8080/api/relay') {
    this.relayUrl = relayUrl;
  }

  /**
   * Broadcast a signed transaction to the relay server
   */
  async broadcast(signedTx: SignedTransaction): Promise<BroadcastResult> {
    try {
      const response = await fetch(`${this.relayUrl}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signedTx),
      });

      if (!response.ok) {
        throw new Error(`Relay error: ${response.statusText}`);
      }

      const result: BroadcastResult = await response.json();
      return result;
    } catch (err: any) {
      console.error('[relay] Broadcast failed:', err);
      return {
        txid: '',
        chainType: signedTx.transaction.chainType,
        status: 'failed',
        timestamp: Date.now(),
        error: err.message,
      };
    }
  }

  /**
   * Get transaction status from relay server
   */
  async getStatus(txid: string, chainType: string): Promise<BroadcastResult | null> {
    try {
      const response = await fetch(`${this.relayUrl}/status/${chainType}/${txid}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.error('[relay] Get status failed:', err);
      return null;
    }
  }

  /**
   * Get gas/fee estimates for a transaction
   */
  async estimateFee(chainType: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    try {
      const response = await fetch(`${this.relayUrl}/estimate-fee/${chainType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      });

      if (!response.ok) throw new Error('Fee estimation failed');
      const data = await response.json();
      return data.fee;
    } catch (err) {
      console.error('[relay] Fee estimation failed:', err);
      return '0';
    }
  }

  /**
   * Get nonce for Ethereum transactions
   */
  async getNonce(address: string): Promise<number> {
    try {
      const response = await fetch(`${this.relayUrl}/nonce/${address}`);
      if (!response.ok) return 0;
      const data = await response.json();
      return data.nonce;
    } catch (err) {
      console.error('[relay] Get nonce failed:', err);
      return 0;
    }
  }

  /**
   * Validate transaction before broadcasting
   */
  async validate(tx: Transaction): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.relayUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });

      if (!response.ok) {
        return { valid: false, error: 'Validation failed' };
      }

      return await response.json();
    } catch (err: any) {
      return { valid: false, error: err.message };
    }
  }
}

export default StatelessRelay;
