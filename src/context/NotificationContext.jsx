import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [showBell, setShowBell] = useState(false);

  const addNotification = useCallback((type, title, body, icon = '🔔') => {
    const id = Date.now() + Math.random();
    const notif = { id, type, title, body, icon, read: false, timestamp: new Date() };

    setNotifications(prev => [notif, ...prev].slice(0, 50)); // keep last 50

    // Show browser push notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.svg' });
      } catch (_) {}
    }

    // Auto-dismiss toast after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id || n.read));
    }, 5000);

    return id;
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentToasts = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      recentToasts,
      showBell,
      setShowBell,
      addNotification,
      markAllRead,
      clearNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
