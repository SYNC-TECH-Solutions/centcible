import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, DollarSign } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (username.length < 3) throw new Error('Username must be at least 3 characters');
        if (!/^[a-zA-Z0-9_]+$/.test(username)) throw new Error('Username can only contain letters, numbers and underscores');
        await signup(email, password, { firstName, lastName, username: username.toLowerCase(), currency });
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please try again.');
    }
    setLoading(false);
  };

  const inputIcon = (icon) => ({
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
    color: 'var(--text-muted)', pointerEvents: 'none',
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', width: '100vw', padding: '24px 16px',
      background: 'radial-gradient(circle at 60% 20%, #2a0b12 0%, #0A0309 70%)',
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="app-logo" style={{ justifyContent: 'center', marginBottom: '12px', fontSize: '2.2rem' }}>
            V<span>aultr</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.85rem' }}>
            {isLogin ? 'Sign in to your secure vault' : 'Start managing your wealth today'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.12)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.3)',
            padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
            fontSize: '0.85rem', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    First Name
                  </label>
                  <input type="text" className="input-field" value={firstName}
                    onChange={e => setFirstName(e.target.value)} required placeholder="John" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Last Name
                  </label>
                  <input type="text" className="input-field" value={lastName}
                    onChange={e => setLastName(e.target.value)} required placeholder="Doe" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Username <span style={{ color: 'var(--primary-color)' }}>(used to connect with partners)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ ...inputIcon(), display: 'flex' }}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>@</span>
                  </span>
                  <input type="text" className="input-field" value={username}
                    onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                    required placeholder="johndoe123"
                    style={{ paddingLeft: '36px' }}
                    minLength={3} maxLength={30} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Preferred Currency
                </label>
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
            </>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ ...inputIcon(), display: 'flex' }}><Mail size={16} /></span>
              <input type="email" className="input-field" value={email}
                onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com" style={{ paddingLeft: '42px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ ...inputIcon(), display: 'flex' }}><Lock size={16} /></span>
              <input type={showPw ? 'text' : 'password'} className="input-field" value={password}
                onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" minLength={6}
                style={{ paddingLeft: '42px', paddingRight: '42px' }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', padding: '4px',
                }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '1rem' }}
            disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#0A0309', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                {isLogin ? 'Signing in…' : 'Creating account…'}
              </span>
            ) : (isLogin ? 'Sign In to Vaultr' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {isLogin
              ? <span>Don't have an account? <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign up free</span></span>
              : <span>Already have an account? <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Sign in</span></span>}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
          🔒 Your data is stored securely and never shared
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
