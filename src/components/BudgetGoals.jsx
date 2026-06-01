import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { Target, Plus, Trash2 } from 'lucide-react';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹'
};

export default function BudgetGoals() {
  const { categories, customCategories, budgets, setBudgetLimit, deleteBudgetLimit, addCategory, deleteCategory, transactions } = useBudget();
  const { userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [limit, setLimit] = useState('');
  
  const [newCatName, setNewCatName] = useState('');

  const currencySymbol = CURRENCY_SYMBOLS[userProfile?.currency || 'USD'] || '$';

  const handleSetLimit = (e) => {
    e.preventDefault();
    if (limit && selectedCategory) {
      setBudgetLimit(selectedCategory, Number(limit));
      setLimit('');
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCatName && !categories.includes(newCatName)) {
      addCategory(newCatName);
      setNewCatName('');
    }
  };

  const getSpentForCategory = (cat) => {
    return transactions.filter(t => t.category === cat).reduce((acc, t) => acc + Number(t.amount), 0);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Budget Goals & Categories</h1>
        <p style={{ color: 'var(--text-muted)' }}>Customize your categories and set monthly limits</p>
      </header>

      <div className="charts-grid">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="var(--primary-color)" /> Set Goal Limit
          </h3>
          <form onSubmit={handleSetLimit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Category</label>
              <select className="input-field" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Monthly Limit ({currencySymbol})</label>
              <input type="number" step="0.01" className="input-field" value={limit} onChange={e => setLimit(e.target.value)} required placeholder="0.00" />
            </div>
            <button type="submit" className="btn-primary">Save Goal</button>
          </form>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="var(--accent-green)" /> Custom Categories
          </h3>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input type="text" className="input-field" placeholder="New category name" value={newCatName} onChange={e => setNewCatName(e.target.value)} required />
            <button type="submit" className="btn-primary">Add</button>
          </form>

          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Your Custom Categories</h4>
            {customCategories.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>None yet.</p>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {customCategories.map(c => (
                  <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {c.name}
                    <button onClick={() => deleteCategory(c.id)} style={{ color: 'var(--accent-red)' }}><Trash2 size={16} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Current Goals</h3>
      <div className="dashboard-grid">
        {Object.keys(budgets).length === 0 && <p style={{ color: 'var(--text-muted)' }}>No goals set.</p>}
        {Object.entries(budgets).map(([cat, data]) => {
          const limitValue = data.limit;
          const spent = getSpentForCategory(cat);
          const percent = Math.min((spent / limitValue) * 100, 100);
          const isOver = spent > limitValue;
          
          return (
            <div key={cat} className="glass-panel stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '600' }}>{cat}</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ color: isOver ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                    {currencySymbol}{spent.toFixed(2)} / {currencySymbol}{limitValue}
                  </span>
                  <button onClick={() => deleteBudgetLimit(cat)} style={{ color: 'var(--text-muted)' }} title="Remove Goal">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', width: `${percent}%`, 
                  background: isOver ? 'var(--accent-red)' : (percent > 80 ? 'var(--accent-orange)' : 'var(--primary-color)'),
                  transition: 'width 0.5s ease'
                }} />
              </div>
              {percent > 80 && !isOver && <p style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', marginTop: '8px' }}>Warning: Approaching limit!</p>}
              {isOver && <p style={{ fontSize: '0.75rem', color: 'var(--accent-red)', marginTop: '8px' }}>Over budget!</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
