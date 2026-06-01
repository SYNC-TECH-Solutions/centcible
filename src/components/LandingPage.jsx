import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Smartphone, Receipt, Users, Shield, Target, FileText,
  ArrowRight, ChevronDown, ChevronUp, Star, Check,
  TrendingUp, CreditCard, MessageCircle, Bell, Download
} from 'lucide-react';

const APK_URL = 'https://github.com/SYNC-TECH-Solutions/centcible/releases/latest/download/app-debug.apk';
const GITHUB_RELEASES = 'https://github.com/SYNC-TECH-Solutions/centcible/releases/latest';

const FEATURES = [
  {
    icon: Receipt,
    title: 'AI Receipt Scanning',
    desc: 'Photograph any receipt and let Google Gemini AI instantly itemize every purchase, flag impulse buys, and suggest smarter alternatives.',
    color: '#A9927D'
  },
  {
    icon: MessageCircle,
    title: 'Partner Hub & Live Chat',
    desc: 'WhatsApp-style real-time messaging with your partner. Tag them with @mentions, react with emojis, and send grocery reminders in one tap.',
    color: '#8b6f5e'
  },
  {
    icon: Target,
    title: 'Budget Goals',
    desc: 'Set monthly spending caps by category with live progress tracking. Receive alerts before you overspend — never be caught off-guard again.',
    color: '#A9927D'
  },
  {
    icon: CreditCard,
    title: 'Loan & Credit Tracker',
    desc: 'Track every outstanding debt, schedule repayments, and visualize your debt-freedom timeline with elegant progress indicators.',
    color: '#8b6f5e'
  },
  {
    icon: FileText,
    title: 'Premium Monthly Statements',
    desc: 'Download beautifully designed PDF reports of your monthly finances, complete with AI-generated tips to improve next month\'s spending.',
    color: '#A9927D'
  },
  {
    icon: TrendingUp,
    title: 'Wealth Intelligence Dashboard',
    desc: 'A birds-eye view of your entire financial life — spending breakdowns, category trends, income vs. expenses, all in stunning interactive charts.',
    color: '#8b6f5e'
  }
];

const STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up in under 60 seconds. Choose your currency and set your financial persona.' },
  { num: '02', title: 'Invite Your Partner', desc: 'Share your account with a partner. Sync groceries, budgets, and chat in real time.' },
  { num: '03', title: 'Scan or Log Expenses', desc: 'Photograph receipts or add expenses manually. Gemini AI categorizes everything for you.' },
  { num: '04', title: 'Get AI Insights', desc: 'Receive personalized savings tips, monthly PDF statements, and budget alerts automatically.' }
];

const TESTIMONIALS = [
  {
    quote: 'Centcible completely changed how my partner and I manage money. The real-time chat and grocery tagging is exactly what we needed.',
    name: 'Priya M.',
    role: 'Marketing Manager, London'
  },
  {
    quote: 'The AI receipt scanning is witchcraft. I photograph my grocery receipt and every item is categorized instantly. Absolutely brilliant.',
    name: 'James T.',
    role: 'Software Engineer, New York'
  },
  {
    quote: 'The monthly PDF statements are so professional I use them for my tax records. Nothing else comes close at this price point.',
    name: 'Fatima A.',
    role: 'Freelance Designer, Dubai'
  }
];

const FAQS = [
  {
    q: 'Is Centcible free to use?',
    a: 'Yes — Centcible is completely free to download and use. No hidden fees, no subscriptions. We believe everyone deserves premium financial tools.'
  },
  {
    q: 'How does the AI receipt scanning work?',
    a: 'We use Google\'s Gemini 2.5 Flash model. You upload a photo of your receipt, and Gemini identifies every line item, maps it to a spending category, flags impulse purchases, and suggests where you could save next time.'
  },
  {
    q: 'Can I use Centcible with my partner?',
    a: 'Absolutely. Enter your partner\'s Centcible username in the Partner Hub and you\'ll instantly share a synchronized ledger, grocery list, and real-time chat. Changes appear instantly on both devices.'
  },
  {
    q: 'Is my financial data safe?',
    a: 'Your data is protected with bank-grade authentication and encryption. We never sell your data to third parties — your financial life stays private.'
  },
  {
    q: 'Does Centcible work on iPhone?',
    a: 'The web app works on all devices including iPhone via any browser. A native iOS app is coming soon — follow our GitHub for release updates.'
  }
];

function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid var(--surface-border)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'var(--transition)',
        background: open ? 'rgba(169,146,125,0.05)' : 'transparent'
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 24px', background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: '16px', textAlign: 'left', color: 'var(--text-main)'
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '1rem', lineHeight: '1.4' }}>{question}</span>
        {open ? <ChevronUp size={18} color="var(--primary-color)" style={{ flexShrink: 0 }} />
               : <ChevronDown size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLaunchApp = () => {
    navigate(currentUser ? '/dashboard' : '/login');
  };

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── STICKY NAV ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 6%', borderBottom: '1px solid var(--surface-border)',
        backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10, 3, 9, 0.85)'
      }}>
        <div className="app-logo" style={{ margin: 0, fontSize: '1.6rem' }}>Cent<span>cible</span></div>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[['Features', '#features'], ['How it Works', '#how'], ['Download', '#download'], ['FAQ', '#faq']].map(([label, href]) => (
            <a key={label} href={href} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href={APK_URL} target="_blank" rel="noreferrer"
            style={{ padding: '8px 16px', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--surface-border)'}
          >
            <Download size={13} /> Android APK
          </a>
          <button onClick={handleLaunchApp} className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.85rem' }}>
            {currentUser ? 'Dashboard' : 'Get Started'}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: 'clamp(80px, 12vw, 140px) 6%',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(73,17,28,0.45) 0%, transparent 70%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(169,146,125,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(73,17,28,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ background: 'rgba(169,146,125,0.1)', padding: '6px 18px', borderRadius: '50px', fontSize: '0.72rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--primary-color)', border: '1px solid rgba(169,146,125,0.25)', marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Star size={12} fill="var(--primary-color)" /> Powered by Google Gemini AI
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontWeight: '600', lineHeight: '1.1', maxWidth: '950px',
          marginBottom: '28px', letterSpacing: '-1.5px'
        }}>
          Your Money, Managed by<br />
          <span style={{ color: 'var(--primary-color)' }}>Artificial Intelligence</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)', fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          maxWidth: '620px', lineHeight: '1.7', marginBottom: '44px', fontWeight: '300'
        }}>
          Centcible combines AI-powered receipt scanning, real-time partner collaboration, and premium monthly statements — free, forever, on every device.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
          <button className="btn-primary" style={{ padding: '15px 36px', fontSize: '1rem', gap: '10px' }} onClick={handleLaunchApp}>
            {currentUser ? 'Open Dashboard' : 'Start for Free'} <ArrowRight size={18} />
          </button>
          <a href={APK_URL} target="_blank" rel="noreferrer"
            className="btn-secondary"
            style={{ padding: '15px 28px', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <Smartphone size={18} /> Download Android App
          </a>
        </div>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {['Free forever', 'No credit card required', 'Android & iOS ready', 'Gemini AI built-in'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={13} color="var(--primary-color)" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: 'clamp(60px, 8vw, 100px) 6%', background: 'rgba(5, 2, 7, 0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Everything You Need</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '700px', margin: '0 auto 16px' }}>
            Built for the Way Modern Couples & Individuals Actually Live
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
            Every feature in Centcible solves a real financial problem — from scanning that grocery receipt to syncing with your partner on the other side of the world.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `rgba(169,146,125,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(169,146,125,0.2)' }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0 }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: 'clamp(60px, 8vw, 100px) 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Simple Setup</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>How Centcible Works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-logo)', fontSize: '3rem', color: 'rgba(169,146,125,0.2)', fontWeight: 700, lineHeight: 1 }}>{num}</div>
              <div style={{ width: '40px', height: '2px', background: 'var(--primary-color)', borderRadius: '2px' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 6%', background: 'rgba(5, 2, 7, 0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Trusted Worldwide</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>What Our Users Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {TESTIMONIALS.map(({ quote, name, role }) => (
            <div key={name} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="var(--primary-color)" color="var(--primary-color)" />)}
              </div>
              <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic', flex: 1 }}>"{quote}"</p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DOWNLOAD ── */}
      <section id="download" style={{
        padding: 'clamp(80px, 10vw, 120px) 6%', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(73,17,28,0.25) 0%, rgba(10,3,9,0.5) 100%)',
        borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)'
      }}>
        <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
          Available Now
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '20px', maxWidth: '700px', margin: '0 auto 20px' }}>
          Take Centcible Everywhere You Go
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 52px', lineHeight: '1.6' }}>
          Download the native Android app for the full experience — camera receipt scanning, offline mode, and push notification budgeting alerts.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {/* Android APK Direct Download */}
          <a href={APK_URL} target="_blank" rel="noreferrer"
            style={{
              background: '#1a1a2e', border: '1px solid var(--surface-border)', borderRadius: '14px',
              padding: '16px 28px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
              transition: 'var(--transition)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', textDecoration: 'none',
              minWidth: '220px'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(74,222,128,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'; }}
          >
            <Smartphone size={32} color="#4ade80" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Download APK for</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-sans)' }}>Android</div>
            </div>
          </a>
          {/* iOS Info */}
          <a href={GITHUB_RELEASES} target="_blank" rel="noreferrer"
            style={{
              background: '#1a1a2e', border: '1px solid var(--surface-border)', borderRadius: '14px',
              padding: '16px 28px', display: 'flex', alignItems: 'center', gap: '14px',
              transition: 'var(--transition)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', textDecoration: 'none',
              minWidth: '220px'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(169,146,125,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'; }}
          >
            <Smartphone size={32} color="var(--primary-color)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Coming soon to</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-sans)' }}>iOS App Store</div>
            </div>
          </a>
        </div>

        {/* GitHub direct link */}
        <a href={GITHUB_RELEASES} target="_blank" rel="noreferrer"
          style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid transparent', transition: 'var(--transition)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-color)'; e.currentTarget.style.borderBottomColor = 'var(--primary-color)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
        >
          View all releases & source code on GitHub →
        </a>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: 'clamp(60px, 8vw, 100px) 6%', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Got Questions?</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map(({ q, a }) => <FAQ key={q} question={q} answer={a} />)}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 6%', textAlign: 'center', background: 'rgba(5, 2, 7, 0.6)', borderTop: '1px solid var(--surface-border)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '20px' }}>
          Ready to Command Your Wealth?
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 44px', lineHeight: '1.6' }}>
          Join thousands of users already taking control of their finances with Centcible's AI-powered platform.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem' }} onClick={handleLaunchApp}>
            {currentUser ? 'Go to Dashboard' : 'Get Started — It\'s Free'} <ArrowRight size={18} />
          </button>
          <a href={APK_URL} target="_blank" rel="noreferrer" className="btn-secondary"
            style={{ padding: '16px 28px', fontSize: '1.05rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <Download size={18} /> Download Android App
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '48px 6% 32px', borderTop: '1px solid var(--surface-border)', background: '#050207' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '48px' }}>
          <div style={{ maxWidth: '300px' }}>
            <div className="app-logo" style={{ margin: '0 0 16px', fontSize: '1.4rem' }}>Cent<span>cible</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Premium AI-powered financial management for individuals and couples. Track expenses, scan receipts, and command your wealth.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.85rem', color: 'var(--primary-color)', letterSpacing: '1px', textTransform: 'uppercase' }}>App</div>
              {[['Web App', '#'], ['Dashboard', '/login'], ['Partner Hub', '/login'], ['Statements', '/login']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <a href={href} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{label}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.85rem', color: 'var(--primary-color)', letterSpacing: '1px', textTransform: 'uppercase' }}>Downloads</div>
              {[['Android APK', APK_URL], ['GitHub Releases', GITHUB_RELEASES], ['Source Code', 'https://github.com/SYNC-TECH-Solutions/centcible']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{label}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <span>© 2026 Centcible Inc. All rights reserved.</span>
          <span>Built with ❤️ by <a href="https://github.com/SherazHussain546" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>SherazHussain546</a> · Powered by Google Gemini AI</span>
        </div>
      </footer>
    </div>
  );
}
