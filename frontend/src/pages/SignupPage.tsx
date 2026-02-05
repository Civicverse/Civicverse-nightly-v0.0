import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading } = useGameStore();

  const validateForm = () => {
    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup(username, 'auto-generated', password);
      navigate('/wallet');
    } catch (err: any) {
      const errorMsg = err?.message || 'Signup failed. Please try again.';
      setError(errorMsg);
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-tropical flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-neon-lime/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-neon"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-neon-orange/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-neon"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-tropical-dark/80 backdrop-blur-xl border border-neon-lime/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-neon-lime-orange"></div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-neon-lime-orange mb-4 shadow-lg"
            >
              <span className="text-3xl font-bold">🚀</span>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-lime via-neon-orange to-neon-pink bg-clip-text text-transparent mb-2 animate-pulse-neon">
              Join CivicVerse
            </h1>
            <p className="text-neon-lime/80 font-medium">Claim Your Non-Custodial Identity</p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/15 border border-red-500/60 rounded-lg flex items-start gap-3 backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-bold text-neon-lime/90 mb-2 uppercase tracking-wider">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-neon-orange group-focus-within:text-neon-lime transition" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose your citizen name"
                  className="w-full pl-10 pr-4 py-3 bg-tropical-surface/60 border border-neon-lime/30 rounded-lg focus:border-neon-orange focus:outline-none focus:ring-2 focus:ring-neon-orange/30 transition text-white placeholder-tropical-accent/60 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-bold text-neon-lime/90 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neon-orange group-focus-within:text-neon-lime transition" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create something strong (8+ chars)"
                  className="w-full pl-10 pr-4 py-3 bg-tropical-surface/60 border border-neon-lime/30 rounded-lg focus:border-neon-orange focus:outline-none focus:ring-2 focus:ring-neon-orange/30 transition text-white placeholder-tropical-accent/60 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-neon-lime/90 mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neon-orange group-focus-within:text-neon-lime transition" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 bg-tropical-surface/60 border border-neon-lime/30 rounded-lg focus:border-neon-orange focus:outline-none focus:ring-2 focus:ring-neon-orange/30 transition text-white placeholder-tropical-accent/60 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-gradient-neon-lime-orange hover:shadow-lg hover:shadow-neon-orange/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition duration-200 flex items-center justify-center gap-2 text-base tracking-wide"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Bootstrapping Identity...
                </>
              ) : (
                <>
                  Launch Civic ID <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-neon-lime/10 border border-neon-lime/30 rounded-lg backdrop-blur-sm"
          >
            <p className="text-neon-lime/90 text-sm font-medium mb-2">
              ✓ Your Civic ID generated securely on-device
            </p>
            <p className="text-neon-lime/80 text-sm">
              ✓ Only YOU hold your private key
            </p>
          </motion.div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon-orange/30 to-transparent"></div>
            <span className="text-neon-orange/60 text-xs uppercase font-bold">Already a citizen?</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon-orange/30 to-transparent"></div>
          </div>

          {/* Login Link */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-tropical-surface/60 hover:bg-tropical-surface border border-neon-orange/30 hover:border-neon-orange/60 text-neon-orange/90 font-bold rounded-lg transition duration-200 text-base"
          >
            Enter via Login
          </motion.button>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-tropical-accent/70 text-xs mt-6 font-medium"
        >
          By creating your account, you agree to our Terms of Service
        </motion.p>
      </motion.div>
    </div>
  );
}
