import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, UserPlus, Send, CheckSquare, Square, Trash2, 
  MessageCircle, ShoppingBag, AtSign, Smile, Bell, X, Check, CheckCheck
} from 'lucide-react';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

function ChatBubble({ msg, isMe, onReact, currentUsername }) {
  const [showEmojis, setShowEmojis] = useState(false);
  const time = msg.date ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  // Highlight @mentions in text
  const renderText = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith('@') ? (
        <span key={i} style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{part}</span>
      ) : part
    );
  };

  return (
    <div style={{
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      maxWidth: '72%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMe ? 'flex-end' : 'flex-start',
      gap: '2px',
      position: 'relative',
    }}>
      {!isMe && (
        <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600, marginLeft: '4px', marginBottom: '2px' }}>
          @{msg.sender}
        </span>
      )}
      <div
        style={{
          background: isMe
            ? 'linear-gradient(135deg, var(--primary-color), #8c7763)'
            : 'rgba(255,255,255,0.07)',
          color: isMe ? '#0A0309' : 'var(--text-main)',
          padding: '10px 14px',
          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          wordBreak: 'break-word',
          border: isMe ? 'none' : '1px solid var(--surface-border)',
          cursor: 'pointer',
          position: 'relative',
        }}
        onDoubleClick={() => setShowEmojis(!showEmojis)}
      >
        {renderText(msg.text)}
        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
          <div style={{
            display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px',
            borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px'
          }}>
            {Object.entries(msg.reactions).map(([emoji, count]) => (
              count > 0 && (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem',
                    color: 'inherit', display: 'flex', alignItems: 'center', gap: '3px'
                  }}
                >
                  {emoji} {count}
                </button>
              )
            ))}
          </div>
        )}
      </div>
      {showEmojis && (
        <div style={{
          position: 'absolute', bottom: '100%', [isMe ? 'right' : 'left']: 0,
          background: 'rgba(10,3,9,0.95)', border: '1px solid var(--surface-border)',
          borderRadius: '24px', padding: '6px 10px', display: 'flex', gap: '6px',
          zIndex: 10, marginBottom: '4px', backdropFilter: 'blur(10px)'
        }}>
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => { onReact(msg.id, e); setShowEmojis(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '2px 4px',
                borderRadius: '8px', transition: 'var(--transition)' }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: isMe ? 0 : '4px', marginRight: isMe ? '4px' : 0 }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{time}</span>
        {isMe && <CheckCheck size={12} color="var(--primary-color)" />}
      </div>
    </div>
  );
}

export default function PartnerHub() {
  const { 
    activeAccount, shareAccount, groceries, chatMessages,
    addGroceryItem, toggleGroceryItem, deleteGroceryItem, sendChatMessage, reactToMessage
  } = useBudget();
  const { userProfile } = useAuth();

  const [shareUsername, setShareUsername] = useState('');
  const [newGrocery, setNewGrocery] = useState('');
  const [newGroceryTag, setNewGroceryTag] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'groceries' | 'people'

  const chatEndRef = useRef(null);
  const msgInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const partners = activeAccount?.sharedWith || [];
  const allUsers = [userProfile?.username, ...partners].filter(Boolean);

  const filteredMentions = allUsers.filter(u =>
    u && u.toLowerCase().includes(mentionQuery.toLowerCase()) && u !== userProfile?.username
  );

  const handleShare = (e) => {
    e.preventDefault();
    if (shareUsername.trim()) {
      shareAccount(shareUsername.trim());
      setShareUsername('');
    }
  };

  const handleAddGrocery = (e) => {
    e.preventDefault();
    if (newGrocery.trim()) {
      const fullText = newGroceryTag ? `${newGrocery.trim()} (for @${newGroceryTag})` : newGrocery.trim();
      addGroceryItem(fullText);
      setNewGrocery('');
      setNewGroceryTag('');
    }
  };

  const handleSendReminder = (item) => {
    if (!activeAccount) return;
    const tagLine = partners.length > 0
      ? `@${partners[0]} reminder: Don't forget "${item.title}" from the grocery list! 🛒`
      : `Reminder: Don't forget "${item.title}" from the grocery list! 🛒`;
    sendChatMessage(tagLine);
    setActiveTab('chat');
  };

  const handleMsgChange = (e) => {
    const val = e.target.value;
    setNewMsg(val);
    const atIdx = val.lastIndexOf('@');
    if (atIdx !== -1 && atIdx === val.length - 1) {
      setMentionQuery('');
      setShowMentionDropdown(true);
    } else if (atIdx !== -1 && val.slice(atIdx).match(/^@\w*$/)) {
      setMentionQuery(val.slice(atIdx + 1));
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const insertMention = (username) => {
    const atIdx = newMsg.lastIndexOf('@');
    const newText = newMsg.slice(0, atIdx) + `@${username} `;
    setNewMsg(newText);
    setShowMentionDropdown(false);
    msgInputRef.current?.focus();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMsg.trim()) {
      sendChatMessage(newMsg.trim());
      setNewMsg('');
      setShowMentionDropdown(false);
    }
  };

  const handleReact = useCallback((msgId, emoji) => {
    if (reactToMessage) reactToMessage(msgId, emoji, userProfile?.username);
  }, [reactToMessage, userProfile]);

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    transition: 'var(--transition)',
    background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
    color: activeTab === tab ? '#0A0309' : 'var(--text-muted)',
    display: 'flex', alignItems: 'center', gap: '6px'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <header>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' }}>Partner Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time chat, grocery coordination, and partner sharing — all in one place.
        </p>
      </header>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '6px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--surface-border)' }}>
        <button style={tabStyle('chat')} onClick={() => setActiveTab('chat')}>
          <MessageCircle size={16} /> Chat
          {chatMessages.length > 0 && <span style={{ background: 'rgba(169,146,125,0.3)', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem' }}>{chatMessages.length}</span>}
        </button>
        <button style={tabStyle('groceries')} onClick={() => setActiveTab('groceries')}>
          <ShoppingBag size={16} /> Groceries
          {groceries.filter(g => !g.completed).length > 0 && (
            <span style={{ background: 'rgba(239,68,68,0.4)', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem' }}>
              {groceries.filter(g => !g.completed).length}
            </span>
          )}
        </button>
        <button style={tabStyle('people')} onClick={() => setActiveTab('people')}>
          <Users size={16} /> People ({allUsers.length})
        </button>
      </div>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '520px', padding: 0, overflow: 'hidden' }}>
          {/* Chat Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {partners.length > 0 ? `Chat with @${partners[0]}` : 'Partner Chat'}
              </div>
              <div style={{ fontSize: '0.7rem', color: partners.length > 0 ? '#4ade80' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {partners.length > 0 ? (
                  <><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />online</>
                ) : 'No partner connected yet'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '20px', display: 'flex',
            flexDirection: 'column', gap: '14px', background: 'rgba(5,2,5,0.4)'
          }}>
            {chatMessages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px' }}>
                <MessageCircle size={48} style={{ opacity: 0.3 }} />
                <span style={{ fontSize: '0.9rem' }}>No messages yet.</span>
                <span style={{ fontSize: '0.8rem' }}>Type a message below to start chatting! Use <strong>@username</strong> to tag your partner.</span>
              </div>
            ) : (
              chatMessages.map(msg => (
                <ChatBubble
                  key={msg.id}
                  msg={msg}
                  isMe={msg.sender === userProfile?.username}
                  onReact={handleReact}
                  currentUsername={userProfile?.username}
                />
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--surface-border)', position: 'relative' }}>
            {showMentionDropdown && filteredMentions.length > 0 && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '20px', right: '20px',
                background: 'rgba(10,3,9,0.95)', border: '1px solid var(--surface-border)',
                borderRadius: '12px', overflow: 'hidden', zIndex: 20, backdropFilter: 'blur(10px)',
                marginBottom: '8px'
              }}>
                <div style={{ padding: '8px 12px', fontSize: '0.7rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)' }}>
                  Tag a partner
                </div>
                {filteredMentions.map(u => (
                  <button
                    key={u}
                    onClick={() => insertMention(u)}
                    style={{
                      width: '100%', padding: '10px 16px', background: 'none',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '0.9rem', transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(169,146,125,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                      {u[0].toUpperCase()}
                    </div>
                    @{u}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  ref={msgInputRef}
                  type="text"
                  className="input-field"
                  placeholder="Message… type @ to mention partner"
                  value={newMsg}
                  onChange={handleMsgChange}
                  style={{ paddingRight: '44px' }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => { setNewMsg(newMsg + '@'); setShowMentionDropdown(true); setMentionQuery(''); msgInputRef.current?.focus(); }}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                  title="Mention a partner"
                >
                  <AtSign size={16} />
                </button>
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '12px 18px', flexShrink: 0 }} disabled={!newMsg.trim()}>
                <Send size={16} />
              </button>
            </form>
            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Double-tap any message to add a reaction ✨ • Type @ to mention your partner
            </div>
          </div>
        </div>
      )}

      {/* GROCERIES TAB */}
      {activeTab === 'groceries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <ShoppingBag size={20} color="var(--primary-color)" /> Add to Grocery List
            </h3>
            <form onSubmit={handleAddGrocery} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Milk, Apples, Bread…"
                  value={newGrocery}
                  onChange={e => setNewGrocery(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0 }}>Add</button>
              </div>
              {partners.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AtSign size={14} color="var(--text-muted)" />
                  <select
                    value={newGroceryTag}
                    onChange={e => setNewGroceryTag(e.target.value)}
                    className="input-field"
                    style={{ width: 'auto', fontSize: '0.85rem', padding: '8px 12px' }}
                  >
                    <option value="">No tag (optional)</option>
                    {partners.map(p => <option key={p} value={p}>@{p}</option>)}
                  </select>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tag a partner to assign the item</span>
                </div>
              )}
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '0' }}>
            <div style={{ padding: '20px 20px 12px 20px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', margin: 0 }}>
                <ShoppingBag size={18} color="var(--primary-color)" /> Shopping List
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {groceries.filter(g => !g.completed).length} remaining
              </span>
            </div>
            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
              {groceries.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Your grocery list is empty. Add items above!
                </div>
              ) : (
                groceries.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: idx < groceries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      background: item.completed ? 'transparent' : 'rgba(255,255,255,0.01)',
                      opacity: item.completed ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div onClick={() => toggleGroceryItem(item.id, !item.completed)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                      {item.completed ? (
                        <CheckSquare size={18} color="var(--primary-color)" />
                      ) : (
                        <Square size={18} color="var(--text-muted)" />
                      )}
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none', fontSize: '0.95rem' }}>
                        {item.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>@{item.addedBy}</span>
                      {!item.completed && partners.length > 0 && (
                        <button
                          onClick={() => handleSendReminder(item)}
                          title="Send as chat reminder"
                          style={{
                            padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(169,146,125,0.3)',
                            background: 'transparent', cursor: 'pointer', fontSize: '0.7rem',
                            color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          <Bell size={12} /> Remind
                        </button>
                      )}
                      <button onClick={() => deleteGroceryItem(item.id)} style={{ color: 'rgba(239,68,68,0.6)', padding: '4px', cursor: 'pointer', background: 'none', border: 'none', borderRadius: '4px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* PEOPLE TAB */}
      {activeTab === 'people' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Connected People */}
          <div className="glass-panel">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="var(--primary-color)" /> Connected People
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allUsers.map(u => (
                <div key={u} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--surface-border)'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', fontWeight: 700, color: 'white', position: 'relative'
                  }}>
                    {u[0].toUpperCase()}
                    <span style={{
                      position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px',
                      background: '#4ade80', borderRadius: '50%', border: '2px solid #0A0309'
                    }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>@{u}</div>
                    <div style={{ fontSize: '0.75rem', color: u === userProfile?.username ? 'var(--primary-color)' : '#4ade80' }}>
                      {u === userProfile?.username ? 'You' : 'Partner • Online'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Partner */}
          {activeAccount?.ownerId === userProfile?.uid && (
            <div className="glass-panel">
              <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="var(--primary-color)" /> Invite a Partner
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Enter their Centcible username to share your budgets, grocery lists, and chat.
              </p>
              <form onSubmit={handleShare} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Partner's username"
                  value={shareUsername}
                  onChange={e => setShareUsername(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0 }}>
                  <UserPlus size={16} /> Invite
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
