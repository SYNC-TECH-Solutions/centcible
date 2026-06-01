import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Receipt, Users, FileText } from 'lucide-react';

// Minimal bottom nav for mobile - shows the 5 most important screens
const mobileNavItems = [
  { path: '/', label: 'Home', icon: <LayoutDashboard size={22} /> },
  { path: '/transactions', label: 'Expenses', icon: <List size={22} /> },
  { path: '/scan', label: 'Scan', icon: <Receipt size={22} /> },
  { path: '/partner', label: 'Partner', icon: <Users size={22} /> },
  { path: '/statements', label: 'Reports', icon: <FileText size={22} /> },
];

export default function MobileNavBar() {
  const location = useLocation();

  return (
    <nav className="mobile-nav-bar" aria-label="Mobile Navigation">
      {mobileNavItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
