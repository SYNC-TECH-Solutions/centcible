import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Camera, User, Save, CheckCircle, Shield, Edit3, AlertTriangle } from 'lucide-react';

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD (CA$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'PKR', label: 'PKR (₨)' },
  { value: 'AED', label: 'AED (د.إ)' },
];

export default function Profile() {
  const { userProfile, updateProfile, logout } = useAuth();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [currency, setCurrency] = useState(userProfile?.currency || 'USD');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [avatarPreview, setAvatarPreview] = useState(userProfile?.avatarUrl || '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);

  // Convert image file → base64 data URL (stored in localStorage via mock)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addNotification('system', 'Image too large', 'Please choose an image under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateUsername = (val) => {
    if (val.length < 3) return 'Username must be at least 3 characters';
    if (val.length > 30) return 'Username must be 30 characters or less';
    if (!/^[a-zA-Z0-9_]+$/.test(val)) return 'Only letters, numbers and underscores allowed';
    return '';
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.replace(/\s/g, '').toLowerCase();
    setUsername(val);
    setUsernameError(validateUsername(val));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const uErr = validateUsername(username);
    if (uErr) { setUsernameError(uErr); return; }
    setSaving(true);
    await updateProfile({ firstName, lastName, username: username.toLowerCase(), currency, avatarUrl });
    setSaving(false);
    setSaved(true);
    setEditingUsername(false);
    addNotification('system', 'Profile updated', 'Your profile has been saved successfully ✨');
    setTimeout(() => setSaved(false), 4000);
  };

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || username?.[0]?.toUpperCase() || '?';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px' }}>
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>Your Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Manage your Vaultr identity, preferences, and account settings
        </p>
      </header>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Avatar Card */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%',
              background: avatarPreview
                ? 'transparent'
                : 'linear-gradient(135deg, var(--primary-color), var(--accent-burgundy))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: 'white',
              border: '3px solid var(--surface-border)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--primary-color)', color: '#0A0309',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0A0309', cursor: 'pointer',
              }}
              title="Change profile picture"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          {/* Identity info */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '2px' }}>
              {firstName} {lastName}
            </div>
            <div style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>
              @{userProfile?.username}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{userProfile?.email}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              marginTop: '8px', padding: '3px 10px', borderRadius: '20px',
              background: 'rgba(169,146,125,0.1)', border: '1px solid rgba(169,146,125,0.2)',
              fontSize: '0.72rem', color: 'var(--primary-color)',
            }}>
              <Shield size={11} /> Vaultr Member
            </div>
          </div>

          {/* Upload hint */}
          <div style={{ width: '100%', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', marginTop: '-8px' }}>
            Click the camera icon to upload a profile picture (max 2MB)
          </div>
        </div>

        {/* Personal Details */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', marginBottom: '4px' }}>
            <User size={18} color="var(--primary-color)" /> Personal Details
          </h3>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                First Name
              </label>
              <input type="text" className="input-field" value={firstName}
                onChange={e => setFirstName(e.target.value)} required placeholder="John" />
            </div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Last Name
              </label>
              <input type="text" className="input-field" value={lastName}
                onChange={e => setLastName(e.target.value)} required placeholder="Doe" />
            </div>
          </div>

          {/* Username field */}
          <div>
            <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Username <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>(shown to partners)</span></span>
              {!editingUsername && (
                <button type="button" onClick={() => setEditingUsername(true)}
                  style={{ fontSize: '0.72rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Edit3 size={12} /> Change
                </button>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--primary-color)', fontWeight: 700, fontSize: '1rem', lineHeight: 1,
              }}>@</span>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={handleUsernameChange}
                disabled={!editingUsername}
                placeholder="yourusername"
                style={{
                  paddingLeft: '32px',
                  opacity: editingUsername ? 1 : 0.6,
                  cursor: editingUsername ? 'text' : 'default',
                  borderColor: usernameError ? 'rgba(239,68,68,0.5)' : undefined,
                }}
              />
            </div>
            {usernameError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#f87171', fontSize: '0.78rem' }}>
                <AlertTriangle size={12} /> {usernameError}
              </div>
            )}
            {editingUsername && !usernameError && (
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '5px' }}>
                ⚠️ Partners use your username to find you — changing it may break existing connections.
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label style={{ display: 'block', marginBottom: '7px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Preferred Currency
            </label>
            <select className="input-field" value={currency} onChange={e => setCurrency(e.target.value)}>
              {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary" disabled={saving || !!usernameError}
            style={{ padding: '13px 32px', fontSize: '0.95rem' }}>
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0A0309', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Saving…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} /> Save Changes
              </span>
            )}
          </button>

          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '0.88rem', animation: 'fadeIn 0.3s ease' }}>
              <CheckCircle size={16} /> Profile saved successfully!
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="glass-panel" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#f87171', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> Danger Zone
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Signing out will end your current session. Your data is safely stored and will be available when you sign back in.
          </p>
          <button type="button" className="btn-danger" onClick={logout}
            style={{ fontSize: '0.85rem', padding: '10px 24px' }}>
            Sign Out of Vaultr
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
