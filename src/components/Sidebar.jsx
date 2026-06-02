import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, List, LogOut, User, Users, FileText, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

function Sidebar() {
  const { logout } = useAuth();
  const { unreadCount, setShowBell } = useNotifications();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard',    label: 'Dashboard',    icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <List size={20} /> },
    { path: '/budget',       label: 'Budget Goals', icon: <Target size={20} /> },
    { path: '/scan',         label: 'Scan Receipt', icon: <Receipt size={20} /> },
    { path: '/loans',        label: 'Loans Tracker',icon: <CreditCard size={20} /> },
    { path: '/partner',      label: 'Partner Hub',  icon: <Users size={20} /> },
    { path: '/statements',   label: 'Statements',   icon: <FileText size={20} /> },
    { path: '/profile',      label: 'Profile',      icon: <User size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Logo */}
        <div className="app-logo">
          V<span>aultr</span>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Notification Bell */}
        <button
          className="nav-link"
          onClick={() => setShowBell(true)}
          style={{ width: '100%', justifyContent: 'flex-start', position: 'relative' }}
        >
          <Bell size={20} />
          Notifications
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: '#ef4444', color: 'white', borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          className="nav-link"
          onClick={logout}
          style={{ width: '100%', justifyContent: 'flex-start', color: 'rgba(239,68,68,0.8)' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
