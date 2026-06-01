import React, { useState, useEffect, useRef } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Send, CheckSquare, Square, Trash, MessageSquare, AlertCircle, ShoppingCart } from 'lucide-react';

export default function PartnerHub() {
  const { 
    activeAccount, 
    shareAccount, 
    groceries, 
    chatMessages, 
    addGroceryItem, 
    toggleGroceryItem, 
    deleteGroceryItem, 
    sendChatMessage 
  } = useBudget();
  const { userProfile } = useAuth();
  
  const [shareUsername, setShareUsername] = useState('');
  const [splitTitle, setSplitTitle] = useState('');
  const [splitAmount, setSplitAmount] = useState('');
  const [splitFriend, setSplitFriend] = useState('');
  const [newGrocery, setNewGrocery] = useState('');
  const [newMsg, setNewMsg] = useState('');
  
  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom when messages load/change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleShare = (e) => {
    e.preventDefault();
    if (shareUsername) {
      shareAccount(shareUsername);
      setShareUsername('');
      alert(`Account shared with @${shareUsername}. They can now sync and chat with you in real-time!`);
    }
  };

  const handleAddGrocery = (e) => {
    e.preventDefault();
    if (newGrocery.trim()) {
      addGroceryItem(newGrocery.trim());
      setNewGrocery('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMsg.trim()) {
      sendChatMessage(newMsg.trim());
      setNewMsg('');
    }
  };

  // Currencies helper
  const currencySymbol = userProfile?.currency === 'EUR' ? '€' : userProfile?.currency === 'GBP' ? '£' : '$';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Partner Space & Groceries</h1>
        <p style={{ color: 'var(--text-muted)' }}>Collaborate with your partner on expenses, lists, and real-time chat</p>
      </header>

      {/* Grid Layout for Partner Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Account Sharing & Access */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Account Access */}
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="var(--primary-color)" /> Account Sharing
            </h3>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Link your partner's username to share your budgets, transaction ledgers, groceries, and chat in real-time.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                <strong>Current Account:</strong> {activeAccount?.name || 'Personal Ledger'}
              </p>
              <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                <strong>Role:</strong> {activeAccount?.ownerId === userProfile?.uid ? 'Owner' : 'Partner (Shared)'}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Shared Access List:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyleType: 'disc', fontSize: '0.9rem' }}>
                <li>@{userProfile?.username} (You)</li>
                {activeAccount?.sharedWith?.map(u => (
                  <li key={u} style={{ color: 'var(--accent-green)' }}>@{u}</li>
                ))}
              </ul>
            </div>

            {activeAccount?.ownerId === userProfile?.uid && (
              <form onSubmit={handleShare} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Partner's username" 
                  value={shareUsername} 
                  onChange={e => setShareUsername(e.target.value)} 
                  required 
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 16px' }} title="Add Partner">
                  <UserPlus size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Card 2: Shared Tips */}
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-orange)' }}>
              <AlertCircle size={18} /> Smart Savings Tip
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Sharing expenses with a partner can reduce your combined utility and grocery spend by up to 22%. Agree on monthly goals together in the <strong>Budget Goals</strong> tab!
            </p>
          </div>
        </div>

        {/* Center Column: Groceries To-Do List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} color="var(--accent-green)" /> Grocery To-Do List
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
            Add items you need. When either of you checks them off, it updates in real-time!
          </p>

          <form onSubmit={handleAddGrocery} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Milk, Apples, Bread..." 
              value={newGrocery} 
              onChange={e => setNewGrocery(e.target.value)} 
              required 
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>Add</button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {groceries.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Your grocery list is empty. Add items above!
              </div>
            ) : (
              groceries.map(item => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    background: item.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: '1px solid var(--surface-border)',
                    opacity: item.completed ? 0.6 : 1,
                    transition: 'var(--transition)'
                  }}
                >
                  <div 
                    onClick={() => toggleGroceryItem(item.id, !item.completed)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                  >
                    {item.completed ? (
                      <CheckSquare size={18} color="var(--accent-green)" />
                    ) : (
                      <Square size={18} color="var(--text-muted)" />
                    )}
                    <span style={{ 
                      textDecoration: item.completed ? 'line-through' : 'none', 
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-main)',
                      fontSize: '0.95rem'
                    }}>
                      {item.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{item.addedBy}</span>
                    <button 
                      onClick={() => deleteGroceryItem(item.id)} 
                      style={{ color: 'rgba(239, 68, 68, 0.7)', padding: '4px', cursor: 'pointer' }}
                      title="Delete Item"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Real-time Partner Chat */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
          <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--accent-purple)" /> Partner Chat
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Send messages to your synced partner. Chats are saved and updated instantly.
          </p>

          {/* Messages pane */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            background: 'rgba(15, 23, 42, 0.4)', 
            border: '1px solid var(--surface-border)', 
            borderRadius: '8px', 
            padding: '16px',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            {chatMessages.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No messages yet. Send a greeting to your partner!
              </div>
            ) : (
              chatMessages.map(msg => {
                const isMe = msg.sender === userProfile?.username;
                return (
                  <div 
                    key={msg.id} 
                    style={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', marginLeft: '4px', marginRight: '4px' }}>
                      @{msg.sender}
                    </span>
                    <div style={{ 
                      background: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                      color: 'white',
                      padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '0.9rem',
                      wordBreak: 'break-word',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input form */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Type message here..." 
              value={newMsg} 
              onChange={e => setNewMsg(e.target.value)} 
              required 
            />
            <button type="submit" className="btn-primary" style={{ padding: '12px 16px' }}>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
