import React, { useEffect, useRef } from 'react';
import { Bell, X, Check, MessageCircle, ShoppingBag, TrendingDown, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const iconMap = {
  chat: <MessageCircle size={16} color="#60a5fa" />,
  grocery: <ShoppingBag size={16} color="#34d399" />,
  budget: <AlertTriangle size={16} color="#f59e0b" />,
  system: <Bell size={16} color="#A9927D" />,
};

function NotificationItem({ notif, onClear }) {
  const ago = (() => {
    const diff = (Date.now() - new Date(notif.timestamp)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  })();

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px 16px',
      background: notif.read ? 'transparent' : 'rgba(169,146,125,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      transition: 'background 0.2s',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {iconMap[notif.type] || iconMap.system}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>{notif.title}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{notif.body}</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{ago}</div>
      </div>
      <button
        onClick={() => onClear(notif.id)}
        style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px', flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function NotificationBell() {
  const { notifications, unreadCount, showBell, setShowBell, markAllRead, clearNotification, recentToasts } = useNotifications();
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!showBell) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowBell(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showBell, setShowBell]);

  return (
    <>
      {/* In-app toast stack (bottom-right) */}
      <div style={{
        position: 'fixed', bottom: '80px', right: '20px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        zIndex: 9999, maxWidth: '320px',
      }}>
        {recentToasts.map(n => (
          <div
            key={n.id}
            style={{
              background: 'rgba(15,7,14,0.96)',
              border: '1px solid var(--surface-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
              animation: 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {iconMap[n.type] || iconMap.system}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.body}</div>
            </div>
            <button onClick={() => clearNotification(n.id)} style={{ color: 'var(--text-muted)', padding: '2px' }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Notification Panel Drawer */}
      {showBell && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '340px', maxWidth: '100vw',
            background: 'rgba(10,3,9,0.98)',
            borderLeft: '1px solid var(--surface-border)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
            animation: 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px', borderBottom: '1px solid var(--surface-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={20} color="var(--primary-color)" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: '#ef4444', color: 'white', borderRadius: '10px',
                  padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700,
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{ fontSize: '0.75rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={13} /> Mark all read
                </button>
              )}
              <button onClick={() => setShowBell(false)} style={{ color: 'var(--text-muted)', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '200px', gap: '12px', color: 'var(--text-muted)',
              }}>
                <Bell size={40} style={{ opacity: 0.3 }} />
                <span style={{ fontSize: '0.9rem' }}>No notifications yet</span>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationItem key={n.id} notif={n} onClear={clearNotification} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
