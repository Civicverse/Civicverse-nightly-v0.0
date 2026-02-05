import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-dark-800 border border-dark-700 rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back{user ? `, ${user.username}` : ''}</h1>
            <p className="text-dark-300">Choose where to go next</p>
          </div>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-dark-700 rounded-lg text-white mr-2"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/foyer')}
              className="px-4 py-2 bg-gradient-civic rounded-lg text-white"
            >
              Open Foyer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Foyer</h2>
            <p className="text-dark-300 mb-4">Enter the main lobby — access marketplace, missions, and the 3D foyer world.</p>
            <div className="flex gap-2">
              <button onClick={() => navigate('/foyer')} className="px-4 py-2 bg-gradient-civic rounded-lg text-white">Open Foyer</button>
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">P2P Lobby</h2>
            <p className="text-dark-300 mb-4">Join the peer-to-peer lobby for direct player-to-player sessions.</p>
            <div>
              <button onClick={() => navigate('/mmorpg')} className="px-4 py-2 bg-dark-700 rounded-lg text-white">Open P2P Lobby</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
