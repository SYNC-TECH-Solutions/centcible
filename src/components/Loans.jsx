import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Plus } from 'lucide-react';

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  INR: '₹'
};

export default function Loans() {
  const { loans, addLoan, updateLoan } = useBudget();
  const { userProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  const currencySymbol = CURRENCY_SYMBOLS[userProfile?.currency || 'USD'] || '$';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !totalAmount) return;
    addLoan({ title, totalAmount: Number(totalAmount), paidAmount: Number(paidAmount) || 0 });
    setTitle('');
    setTotalAmount('');
    setPaidAmount('');
    setShowForm(false);
  };

  const handlePay = (id, currentPaid, total, amountToAdd) => {
    const newPaid = Math.min(currentPaid + amountToAdd, total);
    updateLoan(id, { paidAmount: newPaid });
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Loans Tracker</h1>
          <p style={{ color: 'var(--text-muted)' }}>Keep track of your personal debts and loans</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Loan
        </button>
      </header>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Loan Title</label>
              <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Car Loan" />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Total Amount ({currencySymbol})</label>
              <input type="number" step="0.01" className="input-field" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} required />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Already Paid ({currencySymbol})</label>
              <input type="number" step="0.01" className="input-field" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" style={{ flex: '0 0 auto' }}>Save Loan</button>
          </form>
        </div>
      )}

      <div className="dashboard-grid">
        {loans.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }} className="glass-panel">
            No loans tracked yet. Add one!
          </div>
        ) : (
          loans.map(loan => {
            const percent = Math.min((loan.paidAmount / loan.totalAmount) * 100, 100);
            const isPaidOff = percent === 100;
            return (
              <div key={loan.id} className="glass-panel stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px', alignItems: 'center' }}>
                  <h3 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} color="var(--primary-color)" /> {loan.title}
                  </h3>
                  {isPaidOff && <span style={{ color: 'var(--accent-green)', fontSize: '0.875rem', fontWeight: '600' }}>PAID OFF</span>}
                </div>
                
                <div style={{ marginBottom: '8px', color: 'var(--text-muted)', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Paid: {currencySymbol}{loan.paidAmount.toFixed(2)}</span>
                  <span>Total: {currencySymbol}{loan.totalAmount.toFixed(2)}</span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ height: '100%', width: `${percent}%`, background: isPaidOff ? 'var(--accent-green)' : 'var(--primary-color)', transition: 'width 0.5s ease' }} />
                </div>

                {!isPaidOff && (
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button className="btn-primary" style={{ flex: 1, padding: '6px', fontSize: '0.875rem' }} onClick={() => handlePay(loan.id, loan.paidAmount, loan.totalAmount, 50)}>+ {currencySymbol}50</button>
                    <button className="btn-primary" style={{ flex: 1, padding: '6px', fontSize: '0.875rem' }} onClick={() => handlePay(loan.id, loan.paidAmount, loan.totalAmount, 100)}>+ {currencySymbol}100</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
