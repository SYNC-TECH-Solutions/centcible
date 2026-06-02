import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import Sidebar from './components/Sidebar';
import MobileNavBar from './components/MobileNavBar';
import MobileTopBar from './components/MobileTopBar';
import NotificationBell from './components/NotificationBell';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import BudgetGoals from './components/BudgetGoals';
import ReceiptScanner from './components/ReceiptScanner';
import Login from './components/Login';
import Profile from './components/Profile';
import Loans from './components/Loans';
import Statements from './components/Statements';
import PartnerHub from './components/PartnerHub';

// Detect if running inside a Capacitor native app (Android / iOS)
const isNative = () => {
  try {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  } catch (_) {
    return false;
  }
};

const AuthGuard = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

function VaultrApp() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <Router>
      <BudgetProvider>
        {!currentUser ? (
          <Routes>
            {/* On native mobile → go straight to login; on web → show marketing page */}
            <Route path="/" element={isNative() ? <Navigate to="/login" /> : <LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <div className="layout-container">
            {/* Desktop sidebar (hidden on mobile via CSS) */}
            <Sidebar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
              {/* Mobile top bar (shown only on mobile via CSS) */}
              <MobileTopBar />

              <main className="main-content">
                <Routes>
                  <Route path="/"            element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard"   element={<AuthGuard><Dashboard /></AuthGuard>} />
                  <Route path="/transactions" element={<AuthGuard><TransactionList /></AuthGuard>} />
                  <Route path="/budget"      element={<AuthGuard><BudgetGoals /></AuthGuard>} />
                  <Route path="/scan"        element={<AuthGuard><ReceiptScanner /></AuthGuard>} />
                  <Route path="/loans"       element={<AuthGuard><Loans /></AuthGuard>} />
                  <Route path="/statements"  element={<AuthGuard><Statements /></AuthGuard>} />
                  <Route path="/partner"     element={<AuthGuard><PartnerHub /></AuthGuard>} />
                  <Route path="/profile"     element={<AuthGuard><Profile /></AuthGuard>} />
                  <Route path="*"            element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>

            {/* Mobile bottom navigation bar */}
            <MobileNavBar />

            {/* Global notification panel + toasts */}
            <NotificationBell />
          </div>
        )}
      </BudgetProvider>
    </Router>
  );
}

export default VaultrApp;
