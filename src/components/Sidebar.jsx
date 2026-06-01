import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, List, LogOut, User, Users, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <List size={20} /> },
    { path: '/budget', label: 'Budget Goals', icon: <Target size={20} /> },
    { path: '/scan', label: 'Scan Receipt', icon: <Receipt size={20} /> },
    { path: '/loans', label: 'Loans Tracker', icon: <CreditCard size={20} /> },
    { path: '/partner', label: 'Partner Hub', icon: <Users size={20} /> },
    { path: '/statements', label: 'Statements', icon: <FileText size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="app-logo">
          Cent<span>cible</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <button className="nav-link" onClick={logout} style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--accent-red)' }}>
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
