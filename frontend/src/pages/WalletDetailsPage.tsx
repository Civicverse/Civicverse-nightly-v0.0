import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Wallet Details - Display non-custodial multi-chain addresses
 */
export function WalletDetailsPage() {
  const { multiChainAddresses } = useGameStore();
  const [copiedChain, setCopiedChain] = useState<string | null>(null);

  const copyToClipboard = (address: string, chain: string) => {
    navigator.clipboard.writeText(address);
    setCopiedChain(chain);
    setTimeout(() => setCopiedChain(null), 2000);
  };

  const chains = [
    { name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: 'from-orange-500 to-yellow-600' },
    { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: 'from-blue-500 to-purple-600' },
    { name: 'Kaspa', symbol: 'KASPA', icon: 'K', color: 'from-green-500 to-emerald-600' },
    { name: 'Monero', symbol: 'MONERO', icon: 'ɱ', color: 'from-red-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Multi-Chain Addresses</h1>
          <p className="text-dark-300">Your non-custodial blockchain addresses</p>
          <p className="text-dark-400 text-sm mt-4">
            ✓ Only you hold private keys | Generated locally | Never transmitted
          </p>
        </div>

        {/* Blockchain Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {chains.map((chain) => {
            const address = multiChainAddresses?.[chain.symbol];
            if (!address) return null;

            return (
              <motion.div
                key={chain.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${chain.color} rounded-xl p-6 shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-white/80">{chain.icon}</div>
                    <div>
                      <h3 className="text-white font-bold">{chain.name}</h3>
                      <p className="text-white/60 text-sm">{chain.symbol}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-white/90 font-mono text-xs break-all mb-3">{address}</p>
                  <button
                    onClick={() => copyToClipboard(address, chain.symbol)}
                    className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 text-sm"
                  >
                    {copiedChain === chain.symbol ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Address
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 border border-dark-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">🔐 Non-Custodial Security</h2>
          <div className="space-y-3 text-dark-300">
            <p>
              ✓ <strong>Your keys, your coins</strong> - Private keys never leave your device
            </p>
            <p>
              ✓ <strong>Deterministic wallet</strong> - Same addresses generated from your seed phrase every time
            </p>
            <p>
              ✓ <strong>Multiple blockchains</strong> - Single seed controls Bitcoin, Ethereum, Kaspa & Monero
            </p>
            <p>
              ✓ <strong>No recovery authority</strong> - Only your backup seed phrase can restore access
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-700">
            <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Important</h3>
            <p className="text-dark-400 text-sm">
              Store your 12-word seed phrase securely offline. It's your only recovery method if you lose device access. Never share it with anyone.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WalletDetailsPage;
