import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Profile() {
  const { userProfile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [currency, setCurrency] = useState(userProfile?.currency || 'USD');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({ firstName, lastName, currency });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Your Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details and preferences</p>
      </header>

      <div className="glass-panel" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>@{userProfile?.username}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{userProfile?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>First Name</label>
              <input type="text" className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Last Name</label>
              <input type="text" className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Preferred Currency</label>
            <select className="input-field" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>Save Changes</button>
          {saved && <span style={{ color: 'var(--accent-green)', marginLeft: '16px' }}>Changes saved successfully!</span>}
        </form>
      </div>
    </div>
  );
}
