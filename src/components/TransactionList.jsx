import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹'
};

export default function TransactionList() {
  const { transactions, categories, addTransaction, deleteTransaction } = useBudget();
  const { userProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  const currencySymbol = CURRENCY_SYMBOLS[userProfile?.currency || 'USD'] || '$';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return;
    
    const dateObj = new Date(date);
    
    addTransaction({ title, amount: Number(amount), category, date: dateObj.toISOString() });
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Transactions</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your expenses</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Expense
        </button>
      </header>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Title</label>
              <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Coffee" />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Amount ({currencySymbol})</label>
              <input type="number" step="0.01" className="input-field" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c} style={{ background: 'var(--bg-color)' }}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ flex: '0 0 auto' }}>Save</button>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '0' }}>
        {transactions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet. Add one!</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: '500' }}>Date</th>
                  <th style={{ padding: '16px 24px', fontWeight: '500' }}>Title</th>
                  <th style={{ padding: '16px 24px', fontWeight: '500' }}>Category</th>
                  <th style={{ padding: '16px 24px', fontWeight: '500' }}>Amount</th>
                  <th style={{ padding: '16px 24px', fontWeight: '500', width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 24px' }}>{new Date(t.date).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>
                      {t.title}
                      {t.addedBy && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by @{t.addedBy}</div>}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: t.category === 'Useless' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)',
                        color: t.category === 'Useless' ? 'var(--accent-red)' : 'var(--text-main)',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem' 
                      }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>{currencySymbol}{Number(t.amount).toFixed(2)}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <button onClick={() => deleteTransaction(t.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
