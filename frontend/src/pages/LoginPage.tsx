import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useGameStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      await login('device-local', password);
      navigate('/wallet');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your password or sign up first.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-civic mb-4">
              <span className="text-2xl font-bold">⚔️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CivicVerse</h1>
            <p className="text-dark-300">Non-Custodial Login</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg focus:border-civic-500 focus:outline-none focus:ring-2 focus:ring-civic-500/20 transition text-white placeholder-dark-400"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-civic rounded-lg font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-300 text-sm">
              No account yet?{' '}
              <a href="/signup" className="text-civic-400 hover:text-civic-300 font-medium">
                Create one
              </a>
            </p>
          </div>

          <div className="mt-6 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
            <p className="text-xs text-dark-300">
              🔒 <strong>Non-Custodial:</strong> Your identity and wallet are encrypted on this device. We never see your password or private keys.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
