import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, AlertCircle, BookOpen } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#6b7280'];

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹'
};

export default function Dashboard() {
  const { transactions, budgets, activeAccount } = useBudget();
  const { userProfile } = useAuth();

  const currencySymbol = CURRENCY_SYMBOLS[userProfile?.currency || 'USD'] || '$';

  const totalSpent = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const totalBudget = Object.values(budgets).reduce((acc, b) => acc + Number(b.limit), 0);
  const uselessSpent = transactions.filter(t => t.category === 'Useless').reduce((acc, t) => acc + Number(t.amount), 0);

  const budgetPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  // Group by category for Pie Chart
  const categoryDataMap = {};
  transactions.forEach(t => {
    if (!categoryDataMap[t.category]) categoryDataMap[t.category] = 0;
    categoryDataMap[t.category] += Number(t.amount);
  });
  const pieData = Object.keys(categoryDataMap).map(k => ({ name: k, value: categoryDataMap[k] }));

  // Group by date for Bar Chart (last 7 days)
  const barDataMap = {};
  for(let i=6; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    barDataMap[dateStr] = 0;
  }
  transactions.forEach(t => {
    const d = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (barDataMap[d] !== undefined) barDataMap[d] += Number(t.amount);
  });
  const barData = Object.keys(barDataMap).map(k => ({ date: k, amount: barDataMap[k] }));

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Welcome, {userProfile?.firstName}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {activeAccount?.name || 'Personal Account'} Overview
          {totalSpent > totalBudget && totalBudget > 0 && <span style={{ color: 'var(--accent-red)', marginLeft: '12px' }}>⚠️ You are over your total budget.</span>}
        </p>
      </header>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="stat-info">
              <h3>Total Spent vs Budget</h3>
              <p>
                {currencySymbol}{totalSpent.toFixed(2)}{' '}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                  / {currencySymbol}{totalBudget.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="stat-icon blue">
              <DollarSign size={24} />
            </div>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${budgetPercent}%`, background: budgetPercent > 100 ? 'var(--accent-red)' : 'var(--primary-color)' }} />
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ border: uselessSpent > 0 ? '1px solid rgba(239, 68, 68, 0.5)' : undefined }}>
          <div className="stat-info">
            <h3 style={{ color: uselessSpent > 0 ? 'var(--accent-red)' : undefined }}>Impulse / Useless Spend</h3>
            <p style={{ color: uselessSpent > 0 ? 'var(--accent-red)' : undefined }}>
              {currencySymbol}{uselessSpent.toFixed(2)}
            </p>
          </div>
          <div className="stat-icon red">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Spending Last 7 Days</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(val) => `${currencySymbol}${val}`} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }} />
                <Bar dataKey="amount" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Category Distribution</h3>
          <div style={{ width: '100%', height: '300px' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No data to display
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={20} /> Savings Tips & Blogs</h3>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>The 50/30/20 Rule</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Learn how to split your income between Needs (50%), Wants (30%), and Savings (20%).</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Cutting "Useless" Spend</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Scan your receipts! Finding small, daily leaks in your budget can save you thousands a year.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Snowballing Debt</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Use the Loans Tracker to focus on paying off your smallest debts first to build momentum.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
