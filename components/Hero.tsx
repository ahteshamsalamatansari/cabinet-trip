'use client';

import { Building2, Plus, ChevronDown } from 'lucide-react';

interface HeroProps {
  companyBalance: number;
  onDeposit: () => void;
  onScrollDown: () => void;
}

export default function Hero({
  companyBalance,
  onDeposit,
  onScrollDown,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ padding: '16px' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#1a1040] to-[#0a0f1e]" />

      {/* Animated particles / bokeh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bokeh-1" />
        <div className="bokeh-2" />
        <div className="bokeh-3" />
        <div className="bokeh-4" />
      </div>

      {/* Stars overlay */}
      <div className="absolute inset-0 stars-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center w-full" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Website Name */}
        <div className="animate-fade-in-up">
          <p style={{ color: 'rgba(245, 158, 11, 0.8)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '16px' }}>
            ✈️ Cabinet Trip 2026 ✈️
          </p>
        </div>

        {/* Main Tagline */}
        <h1 className="animate-fade-in-scale hero-tagline hero-gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', fontWeight: 900, lineHeight: 1, marginBottom: '24px' }}>
          TUM GHAR PER
          <br />
          RAHO RAFALE
        </h1>

        {/* Decorative line */}
        <div className="animate-fade-in-up animation-delay-200" style={{ width: '96px', height: '2px', background: 'linear-gradient(to right, transparent, #f59e0b, transparent)', margin: '0 auto 32px' }} />

        {/* Trip Dates */}
        <p className="animate-fade-in-up animation-delay-400" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '40px' }}>
          31st March – 3rd April 2025
        </p>

        {/* COMPANY Balance Widget */}
        <div className="animate-fade-in-up animation-delay-600" style={{ maxWidth: '440px', margin: '0 auto' }}>
          <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 style={{ color: '#f59e0b' }} size={20} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Company Balance
                </span>
              </div>
              <button
                onClick={onDeposit}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', color: '#fcd34d', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <Plus size={14} />
                Deposit
              </button>
            </div>
            <p
              className={companyBalance > 0 ? 'company-glow-green' : ''}
              style={{ fontSize: '36px', fontWeight: 700, color: companyBalance > 0 ? '#f59e0b' : '#ef4444' }}
            >
              ₹{companyBalance.toFixed(2)}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '8px' }}>
              Expenses are deducted from this balance first
            </p>
          </div>
        </div>
      </div>

      {/* Scroll CTA */}
      <button
        onClick={onScrollDown}
        className="absolute"
        style={{ bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s' }}
      >
        <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          View Dashboard
        </span>
        <ChevronDown
          size={24}
          className="animate-bounce"
        />
      </button>
    </section>
  );
}
