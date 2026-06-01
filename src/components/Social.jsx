import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus } from 'lucide-react';
import { getFirestore, collection, addDoc, query, where, getDocs } from '../firebase.mock';

export default function Social() {
  const { activeAccount, shareAccount } = useBudget();
  const { userProfile } = useAuth();
  const [shareUsername, setShareUsername] = useState('');
  
  const [splits, setSplits] = useState([]);
  const [splitTitle, setSplitTitle] = useState('');
  const [splitAmount, setSplitAmount] = useState('');
  const [splitFriend, setSplitFriend] = useState('');
  
  const db = getFirestore();

  useEffect(() => {
    if (activeAccount) fetchSplits();
  }, [activeAccount]);

  const fetchSplits = async () => {
    const q = query(collection(db, 'splits'), where('accountId', '==', activeAccount.id));
    const snap = await getDocs(q);
    setSplits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (shareUsername) {
      shareAccount(shareUsername);
      setShareUsername('');
      alert(`Account shared with @${shareUsername}`);
    }
  };

  const handleAddSplit = async (e) => {
    e.preventDefault();
    if (!splitTitle || !splitAmount || !splitFriend) return;
    const newSplit = {
      accountId: activeAccount.id,
      title: splitTitle,
      amount: Number(splitAmount),
      friend: splitFriend,
      addedBy: userProfile.username,
      date: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'splits'), newSplit);
    setSplits([...splits, { id: docRef.id, ...newSplit }]);
    setSplitTitle(''); setSplitAmount(''); setSplitFriend('');
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Joint Account & Splits</h1>
        <p style={{ color: 'var(--text-muted)' }}>Share your ledger and track IOUs with friends</p>
      </header>

      <div className="charts-grid">
        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} /> Account Access</h3>
          <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
            <strong>Current Account:</strong> {activeAccount?.name} <br/>
            <strong>Owner:</strong> {activeAccount?.ownerId === userProfile?.uid ? 'You' : 'Someone Else'}
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Shared With:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              {activeAccount?.sharedWith?.length === 0 && <li>No one yet.</li>}
              {activeAccount?.sharedWith?.map(u => <li key={u}>@{u}</li>)}
            </ul>
          </div>

          {activeAccount?.ownerId === userProfile?.uid && (
            <form onSubmit={handleShare} style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              <input type="text" className="input-field" placeholder="Friend's username" value={shareUsername} onChange={e => setShareUsername(e.target.value)} required />
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}><UserPlus size={18} /></button>
            </form>
          )}
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px' }}>Record a Split (IOU)</h3>
          <form onSubmit={handleAddSplit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" className="input-field" placeholder="What for? (e.g. Pizza)" value={splitTitle} onChange={e => setSplitTitle(e.target.value)} required />
            <input type="number" step="0.01" className="input-field" placeholder="Amount they owe you" value={splitAmount} onChange={e => setSplitAmount(e.target.value)} required />
            <input type="text" className="input-field" placeholder="Friend's username" value={splitFriend} onChange={e => setSplitFriend(e.target.value)} required />
            <button type="submit" className="btn-primary">Add IOU</button>
          </form>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Pending Splits</h3>
        {splits.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No split payments recorded.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {splits.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <strong style={{ display: 'block' }}>{s.title}</strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>@{s.friend} owes @{s.addedBy}</span>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                  ${Number(s.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
