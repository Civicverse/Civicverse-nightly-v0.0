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
    { name: 'Bitcoin', symbol: 'BTC', icon: '₿', gradient: 'from-orange-500 via-red-600 to-red-700', neonColor: 'neon-orange' },
    { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', gradient: 'from-blue-500 via-purple-600 to-purple-700', neonColor: 'neon-purple' },
    { name: 'Kaspa', symbol: 'KASPA', icon: 'K', gradient: 'from-green-500 via-emerald-600 to-emerald-700', neonColor: 'neon-lime' },
    { name: 'Monero', symbol: 'MONERO', icon: 'ɱ', gradient: 'from-red-500 via-pink-600 to-pink-700', neonColor: 'neon-pink' },
  ];

  return (
    <div className="min-h-screen bg-gradient-tropical relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-neon-cyan/15 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-neon"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-neon-pink/15 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-neon"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-orange bg-clip-text text-transparent mb-3 animate-pulse-neon">
            Multi-Chain Wallet
          </h1>
          <p className="text-neon-cyan/80 text-lg font-medium">Your non-custodial addresses across four blockchains</p>
          <p className="text-tropical-accent/80 text-sm mt-4 flex items-center gap-2">
            <span className="text-neon-lime">✓</span> Only you hold private keys <span className="text-neon-lime">|</span>
            <span className="text-neon-lime">✓</span> Generated locally <span className="text-neon-lime">|</span>
            <span className="text-neon-lime">✓</span> Never transmitted
          </p>
        </motion.div>

        {/* Blockchain Addresses Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {chains.map((chain, idx) => {
            const address = multiChainAddresses?.[chain.symbol];
            if (!address) return null;

            return (
              <motion.div
                key={chain.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className={`relative group bg-gradient-to-br ${chain.gradient} rounded-xl p-0.5 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition`}
              >
                {/* Inner content */}
                <div className="bg-tropical-dark/95 backdrop-blur-xl rounded-xl p-6 relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-neon-glow opacity-0 group-hover:opacity-100 transition duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl font-bold text-white/80"
                        >
                          {chain.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{chain.name}</h3>
                          <p className="text-white/60 text-sm font-medium tracking-wider">{chain.symbol}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-tropical-surface/50 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-white/90 font-mono text-xs break-all mb-4 leading-relaxed">{address}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(address, chain.symbol)}
                        className="w-full py-2.5 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 rounded-lg text-white font-bold transition flex items-center justify-center gap-2 text-sm backdrop-blur-sm border border-white/20"
                      >
                        {copiedChain === chain.symbol ? (
                          <>
                            <Check className="w-4 h-4 text-neon-lime" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy Address
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 border border-neon-cyan/40 rounded-xl p-8 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-neon-glow opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
              🔐 Non-Custodial Security Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex gap-3">
                  <span className="text-neon-lime text-lg flex-shrink-0">✓</span>
                  <div>
                    <p className="text-white font-bold mb-1">Your Keys, Your Coins</p>
                    <p className="text-white/70 text-sm">Private keys never leave your device. End-to-end encrypted locally.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-neon-lime text-lg flex-shrink-0">✓</span>
                  <div>
                    <p className="text-white font-bold mb-1">Deterministic Derivation</p>
                    <p className="text-white/70 text-sm">Same addresses generated from your seed phrase every time. BIP-32/44 standard.</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <div className="flex gap-3">
                  <span className="text-neon-lime text-lg flex-shrink-0">✓</span>
                  <div>
                    <p className="text-white font-bold mb-1">Multi-Chain Support</p>
                    <p className="text-white/70 text-sm">One seed controls Bitcoin, Ethereum, Kaspa & Monero addresses.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-neon-lime text-lg flex-shrink-0">✓</span>
                  <div>
                    <p className="text-white font-bold mb-1">No Central Recovery</p>
                    <p className="text-white/70 text-sm">Only your 12-word seed phrase can restore access. No backup codes.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-6 border-t border-neon-cyan/30"
            >
              <p className="text-neon-orange font-bold mb-2 flex items-center gap-2">
                ⚠️ Critical: Protect Your Seed Phrase
              </p>
              <p className="text-white/70 text-sm">
                Your 12-word seed phrase is the master key to your identity and all your funds. Store it securely offline in multiple places. Never share it with anyone, ever. If someone has your seed, they have access to everything.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WalletDetailsPage;
