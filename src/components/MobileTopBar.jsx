import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

// Shown only on mobile (controlled via CSS .mobile-top-bar)
export default function MobileTopBar() {
  const { logout, userProfile } = useAuth();
  const { unreadCount, setShowBell } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="mobile-top-bar">
      {/* App name */}
      <div className="app-logo" style={{ fontSize: '1.2rem', marginBottom: 0, letterSpacing: '3px' }}>
        V<span>aultr</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Notification Bell */}
        <button
          onClick={() => setShowBell(true)}
          style={{ position: 'relative', padding: '8px', color: 'var(--text-muted)' }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '4px', right: '4px',
              background: '#ef4444', color: 'white', borderRadius: '50%',
              width: '16px', height: '16px', fontSize: '0.6rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.85rem', color: 'white',
            overflow: 'hidden', border: '2px solid var(--surface-border)',
            padding: 0,
          }}
        >
          {userProfile?.avatarUrl
            ? <img src={userProfile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : userProfile?.username?.[0]?.toUpperCase() || <User size={14} />
          }
        </button>
      </div>
    </div>
  );
}
