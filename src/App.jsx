import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import BudgetGoals from './components/BudgetGoals';
import ReceiptScanner from './components/ReceiptScanner';
import Login from './components/Login';
import Profile from './components/Profile';
import Loans from './components/Loans';
import Statements from './components/Statements';
import Social from './components/Social';

const AuthGuard = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Router>
      <BudgetProvider>
        {!currentUser ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          <div className="layout-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/transactions" element={<AuthGuard><TransactionList /></AuthGuard>} />
                <Route path="/budget" element={<AuthGuard><BudgetGoals /></AuthGuard>} />
                <Route path="/scan" element={<AuthGuard><ReceiptScanner /></AuthGuard>} />
                <Route path="/loans" element={<AuthGuard><Loans /></AuthGuard>} />
                <Route path="/statements" element={<AuthGuard><Statements /></AuthGuard>} />
                <Route path="/social" element={<AuthGuard><Social /></AuthGuard>} />
                <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        )}
      </BudgetProvider>
    </Router>
  );
}

export default App;
