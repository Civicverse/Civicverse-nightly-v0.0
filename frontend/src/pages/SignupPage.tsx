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
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-civic mb-4">
              <span className="text-2xl font-bold">🚀</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join CivicVerse</h1>
            <p className="text-dark-300">Create your non-custodial identity</p>
          </div>

          {/* Error Alert */}
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

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose your username"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg focus:border-civic-500 focus:outline-none focus:ring-2 focus:ring-civic-500/20 transition text-white placeholder-dark-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg focus:border-civic-500 focus:outline-none focus:ring-2 focus:ring-civic-500/20 transition text-white placeholder-dark-400"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg focus:border-civic-500 focus:outline-none focus:ring-2 focus:ring-civic-500/20 transition text-white placeholder-dark-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2.5 bg-gradient-civic hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-civic-500/10 border border-civic-500/30 rounded-lg">
            <p className="text-civic-200 text-sm">
              ✓ Your Civic ID will be generated securely on your device
            </p>
            <p className="text-civic-200 text-sm mt-2">
              ✓ Only you hold your private key
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-dark-700"></div>
            <span className="text-dark-400 text-xs uppercase">Or</span>
            <div className="flex-1 h-px bg-dark-700"></div>
          </div>

          {/* Login Link */}
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Already have an account? Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-dark-400 text-xs mt-6">
          By signing up, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
