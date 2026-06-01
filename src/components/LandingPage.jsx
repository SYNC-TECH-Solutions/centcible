import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Receipt, Users, Shield, Target, FileText, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLaunchApp = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="animate-fade-in" style={{ background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Luxury Nav Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '24px 8%', 
        borderBottom: '1px solid var(--surface-border)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 3, 9, 0.8)'
      }}>
        <div className="app-logo" style={{ margin: 0, fontSize: '1.8rem' }}>
          Cent<span>cible</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={handleLaunchApp} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
            {currentUser ? 'Go to Dashboard' : 'Launch Web App'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        padding: '80px 24px 100px 24px',
        background: 'radial-gradient(circle at center, #2e080f 0%, var(--bg-color) 60%)'
      }}>
        <div style={{ 
          background: 'rgba(169, 146, 125, 0.08)', 
          padding: '8px 16px', 
          borderRadius: '50px', 
          fontSize: '0.75rem', 
          letterSpacing: '2px', 
          textTransform: 'uppercase', 
          color: 'var(--primary-color)',
          border: '1px solid rgba(169, 146, 125, 0.25)',
          marginBottom: '24px'
        }}>
          Luxury Financial Intelligence
        </div>
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
          fontWeight: '600', 
          lineHeight: '1.15', 
          maxWidth: '900px', 
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          Track Expenses, Sync Partners, and Command Your Wealth
        </h1>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
          maxWidth: '650px', 
          lineHeight: '1.6', 
          marginBottom: '40px',
          fontWeight: '300'
        }}>
          Centcible blends Gemini-powered artificial intelligence with shared partner collaboration to deliver bespoke wealth management in the palm of your hand.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ padding: '14px 32px' }} onClick={handleLaunchApp}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <a href="#download" className="btn-secondary" style={{ padding: '14px 32px' }}>
            Download Mobile App
          </a>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '80px 8%', background: 'rgba(10, 3, 9, 0.5)' }}>
        <h2 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '2.5rem', 
          textAlign: 'center', 
          marginBottom: '50px' 
        }}>
          Designed for Elevated Lifestyles
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px' 
        }}>
          
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'var(--primary-color)' }}><Receipt size={32} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Gemini AI Receipt Analyzer</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Upload any receipt image and our integrated Google Gemini AI model automatically itemizes your expenses, flags impulsive spend items, and recommends savings paths.
            </p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'var(--primary-color)' }}><Users size={32} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Partner Space & Real-Time Sync</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Share budgets and lists with your partner instantly. Coordinate grocery shopping and chat in real-time on a beautifully synchronized shared ledger.
            </p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'var(--primary-color)' }}><Target size={32} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Multi-Currency Goals</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Define monthly category limits and wealth goals using your currency of choice, including USD, EUR, GBP, JPY, INR, CAD, and AUD, with dynamic conversions.
            </p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'var(--primary-color)' }}><FileText size={32} /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Elegant Monthly Statements</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Download printable monthly statements in a premium PDF format complete with customized, data-driven savings tips for the upcoming month.
            </p>
          </div>

        </div>
      </section>

      {/* Download App Section */}
      <section id="download" style={{ 
        padding: '100px 8%', 
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(10, 3, 9, 0.5) 0%, rgba(73, 17, 28, 0.15) 100%)',
        borderTop: '1px solid var(--surface-border)'
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '16px' }}>
          Centcible on Your Mobile Devices
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 48px auto', lineHeight: '1.6' }}>
          Bring luxury finance everywhere. Download the native app for iOS and Android to enable push notifications, camera scanning, and instant widgets.
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          flexWrap: 'wrap', 
          alignItems: 'center' 
        }}>
          {/* iOS Download Button */}
          <a
            href="https://github.com/SYNC-TECH-Solutions/centcible/releases/latest"
            target="_blank"
            rel="noreferrer"
            style={{ 
              background: 'black', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '10px', 
              padding: '12px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              textDecoration: 'none'
            }}
          >
            <Smartphone size={28} color="white" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Download on the</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', fontFamily: 'var(--font-sans)' }}>App Store</div>
            </div>
          </a>

          {/* Android Download Button - links to direct APK */}
          <a
            href="https://github.com/SYNC-TECH-Solutions/centcible/releases/latest/download/app-debug.apk"
            target="_blank"
            rel="noreferrer"
            style={{ 
              background: 'black', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '10px', 
              padding: '12px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              textDecoration: 'none'
            }}
          >
            <Smartphone size={28} color="#78c257" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Get it on</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', fontFamily: 'var(--font-sans)' }}>Google Play</div>
            </div>
          </a>

          {/* Direct GitHub Releases link */}
          <a
            href="https://github.com/SYNC-TECH-Solutions/centcible/releases"
            target="_blank"
            rel="noreferrer"
            style={{ 
              border: '1px solid var(--surface-border)', 
              borderRadius: '10px', 
              padding: '12px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              textDecoration: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}
          >
            All Releases & Source Code →
          </a>
        </div>
      </section>

      {/* Safety Section */}
      <section style={{ padding: '60px 8%', borderTop: '1px solid var(--surface-border)', background: '#070207' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '16px',
          color: 'var(--primary-color)'
        }}>
          <Shield size={24} />
          <span style={{ fontSize: '0.95rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Secure Bank-Grade Authentication Enabled
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '40px 8%', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--surface-border)'
      }}>
        <div className="app-logo" style={{ justifyContent: 'center', fontSize: '1.2rem', marginBottom: '16px' }}>
          Cent<span>cible</span>
        </div>
        <p>© 2026 Centcible Inc. All rights reserved. Wealth management and AI budgeting made premium.</p>
      </footer>
    </div>
  );
}
