import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, List, LogOut, User, Users, FileText, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

function Sidebar() {
  const { logout, userProfile } = useAuth();
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

        {/* User Presence Summary */}
        {userProfile && (
          <div 
            style={{ 
              margin: '0 8px 8px 8px',
              padding: '10px 12px', 
              borderRadius: '12px', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: userProfile?.avatarUrl ? 'transparent' : 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'white',
              overflow: 'hidden', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                `${userProfile?.firstName?.[0] || ''}${userProfile?.lastName?.[0] || ''}`.toUpperCase() || '?'
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left', flex: 1 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                {userProfile?.firstName} {userProfile?.lastName}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}>
                @{userProfile?.username}
              </span>
            </div>
          </div>
        )}

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
