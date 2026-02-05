import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { MissionsPage } from './pages/MissionsPage';
import { WalletPage } from './pages/WalletPage';
import { WalletDetailsPage } from './pages/WalletDetailsPage';
import { GovernancePage } from './pages/GovernancePage';
import { FoyerPage } from './pages/FoyerPage';
import { LandingPage } from './pages/LandingPage';
import { MMORPGPage } from './pages/MMORPGPage';
import { FPSGamePage } from './pages/FPSGamePage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useGameStore((state) => state.isAuthenticated);
  const loading = useGameStore((state) => state.loading);

  // While the app is restoring auth state, avoid redirecting to login
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

// Root redirect component that checks auth at render time
function RootRedirect() {
  const isAuthenticated = useGameStore((state) => state.isAuthenticated);
  const loading = useGameStore((state) => state.loading);

  // Show nothing while loading to prevent flash
  if (loading) return null;

  return isAuthenticated ? (
    <Navigate to="/wallet" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  // Smart auth restoration on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check if we have encrypted identity AND stored session data
        const hasIdentity = localStorage.getItem('civicverse:identity');
        const civicId = localStorage.getItem('civicId');
        const multiChainAddresses = localStorage.getItem('civicverse:multichain');
        
        // Only restore if we have persisted data (don't auto-login without password)
        if (hasIdentity && civicId && multiChainAddresses) {
          try {
            const parsed = JSON.parse(multiChainAddresses);
            const persistedUser = localStorage.getItem('civicverse_user');
            if (persistedUser) {
              const userData = JSON.parse(persistedUser);
              useGameStore.setState({
                isAuthenticated: true,
                user: userData.user,
                wallet: userData.wallet,
                multiChainAddresses: parsed,
                loading: false,
              });
              console.debug('[auth] restored session with encrypted identity check');
            }
          } catch (e) {
            console.warn('Failed to restore session:', e);
            useGameStore.setState({ loading: false });
          }
        } else {
          // No persisted data, start fresh
          useGameStore.setState({ loading: false });
        }
      } catch (e) {
        console.warn('Session restoration error:', e);
        useGameStore.setState({ loading: false });
      }
    };
    
    restoreSession();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/missions"
            element={
              <ProtectedRoute>
                <MissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet-details"
            element={
              <ProtectedRoute>
                <WalletDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          {/* /foyer/3d route removed */}
          <Route
            path="/governance"
            element={
              <ProtectedRoute>
                <GovernancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foyer"
            element={
              <ProtectedRoute>
                <FoyerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mmorpg"
            element={
              <ProtectedRoute>
                <MMORPGPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fpsgame"
            element={
              <ProtectedRoute>
                <FPSGamePage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to appropriate page */}
          <Route path="/" element={<RootRedirect />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
