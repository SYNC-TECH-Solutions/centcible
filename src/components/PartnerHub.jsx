import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Users, UserPlus, Send, CheckSquare, Square, Trash2,
  MessageCircle, ShoppingBag, AtSign, Bell, X, CheckCheck
} from 'lucide-react';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

function ChatBubble({ msg, isMe, onReact, currentUsername }) {
  const [showEmojis, setShowEmojis] = useState(false);
  const time = msg.date
    ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // Highlight @mentions with bright visible styling
  const renderText = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith('@') ? (
        <span
          key={i}
          style={{
            color: '#ffffff',
            background: 'rgba(169,146,125,0.35)',
            borderRadius: '4px',
            padding: '1px 5px',
            fontWeight: 700,
            fontSize: '0.88em',
          }}
        >
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div style={{
      alignSelf: isMe ? 'flex-end' : 'flex-start',
      maxWidth: '76%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMe ? 'flex-end' : 'flex-start',
      gap: '3px',
      position: 'relative',
    }}>
      {/* Sender name for partner messages */}
      {!isMe && (
        <span style={{
          fontSize: '0.7rem',
          color: 'var(--primary-color)',
          fontWeight: 600,
          marginLeft: '6px',
          marginBottom: '1px',
        }}>
          @{msg.sender}
        </span>
      )}

      {/* Bubble */}
      <div
        style={{
          background: isMe
            ? 'linear-gradient(135deg, var(--primary-color) 0%, #7a6553 100%)'
            : 'rgba(255,255,255,0.07)',
          color: isMe ? '#fff' : 'var(--text-main)',
          padding: '10px 15px',
          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          wordBreak: 'break-word',
          border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
        }}
        onDoubleClick={() => setShowEmojis(!showEmojis)}
      >
        {renderText(msg.text)}

        {/* Emoji Reactions */}
        {msg.reactions && Object.keys(msg.reactions).some(e => msg.reactions[e] > 0) && (
          <div style={{
            display: 'flex', gap: '4px', flexWrap: 'wrap',
            marginTop: '7px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '6px',
          }}>
            {Object.entries(msg.reactions).map(([emoji, count]) =>
              count > 0 && (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px', padding: '2px 8px',
                    cursor: 'pointer', fontSize: '0.75rem',
                    color: 'inherit', display: 'flex', alignItems: 'center', gap: '3px',
                  }}
                >
                  {emoji} {count}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Emoji picker */}
      {showEmojis && (
        <div style={{
          position: 'absolute', bottom: '100%', [isMe ? 'right' : 'left']: 0,
          background: 'rgba(12,5,11,0.97)',
          border: '1px solid var(--surface-border)',
          borderRadius: '28px', padding: '7px 12px',
          display: 'flex', gap: '6px',
          zIndex: 10, marginBottom: '6px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => { onReact(msg.id, e); setShowEmojis(false); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.3rem', padding: '2px 4px',
                borderRadius: '8px', transition: 'transform 0.15s',
              }}
              onMouseEnter={el => el.target.style.transform = 'scale(1.3)'}
              onMouseLeave={el => el.target.style.transform = 'scale(1)'}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Timestamp + double-tick */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        marginLeft: isMe ? 0 : '4px',
        marginRight: isMe ? '4px' : 0,
      }}>
        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>{time}</span>
        {isMe && <CheckCheck size={12} color="var(--primary-color)" />}
      </div>
    </div>
  );
}

export default function PartnerHub() {
  const {
    activeAccount, shareAccount, groceries, chatMessages,
    addGroceryItem, toggleGroceryItem, deleteGroceryItem,
    sendChatMessage, reactToMessage,
  } = useBudget();
  const { userProfile } = useAuth();
  const { addNotification } = useNotifications();

  const [shareUsername, setShareUsername] = useState('');
  const [newGrocery, setNewGrocery] = useState('');
  const [newGroceryTag, setNewGroceryTag] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const chatEndRef = useRef(null);
  const msgInputRef = useRef(null);
  const prevMsgCount = useRef(chatMessages.length);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Notify when a partner sends a new message and chat is not visible
  useEffect(() => {
    const newCount = chatMessages.length;
    if (newCount > prevMsgCount.current) {
      const latest = chatMessages[chatMessages.length - 1];
      if (latest && latest.sender !== userProfile?.username) {
        addNotification('chat', `@${latest.sender} sent a message`, latest.text.slice(0, 80));
      }
    }
    prevMsgCount.current = newCount;
  }, [chatMessages, userProfile, addNotification]);

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
      addNotification('system', 'Partner invited', `Invitation sent to @${shareUsername.trim()}`);
    }
  };

  const handleAddGrocery = (e) => {
    e.preventDefault();
    if (newGrocery.trim()) {
      const fullText = newGroceryTag
        ? `${newGrocery.trim()} (for @${newGroceryTag})`
        : newGrocery.trim();
      addGroceryItem(fullText);
      setNewGrocery('');
      setNewGroceryTag('');
      addNotification('grocery', 'Item added', `"${newGrocery.trim()}" added to grocery list 🛒`);
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
    if (atIdx !== -1 && val.slice(atIdx).match(/^@\w*$/)) {
      setMentionQuery(val.slice(atIdx + 1));
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const insertMention = (username) => {
    const atIdx = newMsg.lastIndexOf('@');
    setNewMsg(newMsg.slice(0, atIdx) + `@${username} `);
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
    padding: '9px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.82rem',
    transition: 'var(--transition)',
    background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
    color: activeTab === tab ? '#0A0309' : 'var(--text-muted)',
    display: 'flex', alignItems: 'center', gap: '6px',
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '4px' }}>Partner Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Real-time chat, grocery coordination, and partner sharing.
        </p>
      </header>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: '6px',
        background: 'rgba(255,255,255,0.04)',
        padding: '5px', borderRadius: '12px',
        width: 'fit-content',
        border: '1px solid var(--surface-border)',
        flexWrap: 'wrap',
      }}>
        <button style={tabStyle('chat')} onClick={() => setActiveTab('chat')}>
          <MessageCircle size={15} /> Chat
          {chatMessages.length > 0 && (
            <span style={{
              background: 'rgba(169,146,125,0.3)', borderRadius: '10px',
              padding: '1px 7px', fontSize: '0.68rem',
            }}>
              {chatMessages.length}
            </span>
          )}
        </button>
        <button style={tabStyle('groceries')} onClick={() => setActiveTab('groceries')}>
          <ShoppingBag size={15} /> Groceries
          {groceries.filter(g => !g.completed).length > 0 && (
            <span style={{
              background: 'rgba(239,68,68,0.4)', borderRadius: '10px',
              padding: '1px 7px', fontSize: '0.68rem',
            }}>
              {groceries.filter(g => !g.completed).length}
            </span>
          )}
        </button>
        <button style={tabStyle('people')} onClick={() => setActiveTab('people')}>
          <Users size={15} /> People ({allUsers.length})
        </button>
      </div>

      {/* ═══════════════ CHAT TAB ═══════════════ */}
      {activeTab === 'chat' && (
        <div className="glass-panel" style={{
          display: 'flex', flexDirection: 'column',
          height: 'clamp(400px, 60vh, 640px)',
          padding: 0, overflow: 'hidden',
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid var(--surface-border)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.93rem' }}>
                {partners.length > 0 ? `Chat with @${partners[0]}` : 'Partner Chat'}
              </div>
              <div style={{
                fontSize: '0.68rem',
                color: partners.length > 0 ? '#4ade80' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {partners.length > 0 ? (
                  <>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#4ade80', display: 'inline-block',
                    }} />
                    Online
                  </>
                ) : 'No partner connected yet — invite one below'}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '18px 16px',
            display: 'flex', flexDirection: 'column', gap: '12px',
            background: 'rgba(4,1,4,0.5)',
          }}>
            {chatMessages.length === 0 ? (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', gap: '12px', textAlign: 'center',
              }}>
                <MessageCircle size={44} style={{ opacity: 0.25 }} />
                <span style={{ fontSize: '0.9rem' }}>No messages yet.</span>
                <span style={{ fontSize: '0.78rem', maxWidth: '240px', lineHeight: 1.5 }}>
                  Type a message below to start chatting. Use <strong>@username</strong> to mention your partner.
                </span>
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

            {/* Typing indicator */}
            {isPartnerTyping && (
              <div style={{
                alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', borderRadius: '18px 18px 18px 4px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partner is typing</span>
                <span style={{ display: 'flex', gap: '3px' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'var(--primary-color)', opacity: 0.7,
                      animation: `typingDot 1.2s ${i * 0.4}s infinite`,
                    }} />
                  ))}
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--surface-border)', position: 'relative' }}>
            {/* @mention dropdown */}
            {showMentionDropdown && filteredMentions.length > 0 && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '16px', right: '16px',
                background: 'rgba(10,3,9,0.97)', border: '1px solid var(--surface-border)',
                borderRadius: '12px', overflow: 'hidden', zIndex: 20,
                backdropFilter: 'blur(12px)', marginBottom: '8px',
                boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  padding: '7px 12px', fontSize: '0.68rem',
                  color: 'var(--text-muted)', borderBottom: '1px solid var(--surface-border)',
                }}>
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
                      fontSize: '0.88rem', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(169,146,125,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                    }}>
                      {u[0].toUpperCase()}
                    </div>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>@{u}</span>
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
                  placeholder="Message… type @ to mention"
                  value={newMsg}
                  onChange={handleMsgChange}
                  style={{ paddingRight: '46px' }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewMsg(newMsg + '@');
                    setShowMentionDropdown(true);
                    setMentionQuery('');
                    msgInputRef.current?.focus();
                  }}
                  style={{
                    position: 'absolute', right: '10px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', padding: '4px',
                  }}
                  title="Mention a partner"
                >
                  <AtSign size={16} />
                </button>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px 18px', flexShrink: 0 }}
                disabled={!newMsg.trim()}
              >
                <Send size={16} />
              </button>
            </form>
            <div style={{ marginTop: '6px', fontSize: '0.67rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
              Double-tap any message to react with an emoji ✨
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ GROCERIES TAB ═══════════════ */}
      {activeTab === 'groceries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
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
                <button type="submit" className="btn-primary" style={{ padding: '12px 20px', flexShrink: 0 }}>
                  Add
                </button>
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
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assign to partner</span>
                </div>
              )}
            </form>
          </div>

          <div className="glass-panel" style={{ padding: 0 }}>
            <div style={{
              padding: '18px 20px 12px 20px', borderBottom: '1px solid var(--surface-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', margin: 0 }}>
                <ShoppingBag size={17} color="var(--primary-color)" /> Shopping List
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {groceries.filter(g => !g.completed).length} remaining
              </span>
            </div>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {groceries.length === 0 ? (
                <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Your grocery list is empty. Add items above!
                </div>
              ) : (
                groceries.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 20px',
                      borderBottom: idx < groceries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      opacity: item.completed ? 0.5 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <div
                      onClick={() => toggleGroceryItem(item.id, !item.completed)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                    >
                      {item.completed
                        ? <CheckSquare size={18} color="var(--primary-color)" />
                        : <Square size={18} color="var(--text-muted)" />}
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none', fontSize: '0.93rem' }}>
                        {item.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        @{item.addedBy}
                      </span>
                      {!item.completed && partners.length > 0 && (
                        <button
                          onClick={() => handleSendReminder(item)}
                          title="Send as chat reminder"
                          style={{
                            padding: '4px 8px', borderRadius: '6px',
                            border: '1px solid rgba(169,146,125,0.3)',
                            fontSize: '0.68rem', color: 'var(--primary-color)',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >
                          <Bell size={11} /> Remind
                        </button>
                      )}
                      <button
                        onClick={() => deleteGroceryItem(item.id)}
                        style={{ color: 'rgba(239,68,68,0.6)', padding: '4px' }}
                      >
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

      {/* ═══════════════ PEOPLE TAB ═══════════════ */}
      {activeTab === 'people' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="var(--primary-color)" /> Connected People
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allUsers.map(u => (
                <div key={u} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '13px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--surface-border)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', fontWeight: 700, color: 'white', position: 'relative', flexShrink: 0,
                  }}>
                    {u[0].toUpperCase()}
                    <span style={{
                      position: 'absolute', bottom: '1px', right: '1px',
                      width: '11px', height: '11px',
                      background: '#4ade80', borderRadius: '50%', border: '2px solid #0A0309',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.93rem' }}>@{u}</div>
                    <div style={{ fontSize: '0.72rem', color: u === userProfile?.username ? 'var(--primary-color)' : '#4ade80' }}>
                      {u === userProfile?.username ? 'You' : 'Partner • Online'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Partner */}
          {activeAccount?.ownerId === userProfile?.uid && (
            <div className="glass-panel">
              <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="var(--primary-color)" /> Invite a Partner
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '16px' }}>
                Enter their Vaultr username to share budgets, grocery lists, and chat.
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
