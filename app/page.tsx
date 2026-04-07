'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Hero Components
import WorkflowAnimation from '@/components/WorkflowAnimation';
import MagneticButton from '@/components/MagneticButton';
import Link from 'next/link';

const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });

// Flagship Sections
const ProofBar = dynamic(() => import('@/components/ProofBar'), { ssr: false });
const DemoStrip = dynamic(() => import('@/components/DemoStrip'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
const FeaturedProject = dynamic(() => import('@/components/FeaturedProject'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: false });
const About = dynamic(() => import('@/components/About'), { ssr: false });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false });
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const FloatingChat = dynamic(() => import('@/components/FloatingChat'), { ssr: false });

export default function Home() {
  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--bg)',
      }}
    >
      {/* Wave canvas — z:0, pointer-events:none. All content uses z:10+ */}
      <WaveBackground />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >

        <div
          style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
            maxWidth: '960px',
            marginTop: '80px',
          }}
        >
          {/* Badge */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#a1a1aa', fontWeight: 500 }}>
              N8N · Claude AI · Built for UK Hospitality
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 700,
              marginTop: '32px',
              marginBottom: '16px',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
            }}
          >
            <span style={{ display: 'block', marginBottom: '8px' }} className="hero-heading">
              You run the business.
            </span>
            <span className="hero-heading" style={{ display: 'block' }}>
              AI runs everything else.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '40px',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            We build AI workflows that eliminate repetitive admin — email triage, lead routing, review replies, and more. Powered by n8n and Claude AI. Running 24/7 from day one.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '64px',
            }}
          >
            {/* Primary CTA — white pill */}
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                background: 'var(--text-primary)',
                color: 'var(--bg)',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: '9999px',
                transition: 'opacity 200ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.9')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Book a free 30-min call
              <span style={{ opacity: 0.4, fontSize: '13px' }}>✕</span>
            </Link>

            {/* Secondary CTA — dark glass */}
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 24px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                borderRadius: '8px',
                border: '1px solid var(--border-mid)',
                backdropFilter: 'blur(8px)',
                transition: 'background 200ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-card)')}
            >
              See the demo
              <kbd style={{
                background: 'var(--bg-hover)',
                color: 'var(--text-muted)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}>⌘K</kbd>
            </Link>
          </motion.div>
        </div>

        {/* ── Hero Showcase Panel ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '900px',
            marginBottom: '40px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(8, 12, 24, 0.75)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* ── Pipeline overview header ────────────────────── */}
          <div style={{
            padding: '22px 28px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            overflowX: 'auto' as const,
          }}>
            {[
              { icon: '✉', label: 'TASK INPUT',    sub: 'Email / review / form',  color: '#60a5fa', active: false },
              { icon: '⚡', label: 'n8n ENGINE',    sub: 'Claude AI + n8n',        color: '#a855f7', active: true  },
              { icon: '📥', label: 'EMAIL TRIAGE',  sub: 'Classify & prioritise',  color: '#ef4444', active: false },
              { icon: '↗', label: 'LEAD ROUTING',  sub: 'Score & push to CRM',    color: '#10b981', active: false },
              { icon: '💬', label: 'REPLY DRAFTING',sub: 'In your voice, instant', color: '#f59e0b', active: false },
            ].map((node, i, arr) => (
              <div key={node.label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {/* Node */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${node.active ? node.color + '55' : 'rgba(255,255,255,0.08)'}`,
                  background: node.active ? node.color + '14' : 'rgba(255,255,255,0.02)',
                  boxShadow: node.active ? `0 0 24px ${node.color}22` : 'none',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '108px',
                  transition: 'all 300ms ease',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: node.active ? node.color + '22' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${node.active ? node.color + '44' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px',
                  }}>
                    {node.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: node.active ? node.color : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
                      {node.sub}
                    </div>
                  </div>
                </div>
                {/* Connector */}
                {i < arr.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', flexShrink: 0 }}>
                    <div style={{ height: '1px', width: '28px', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                      <motion.div
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
                        style={{
                          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                          width: '5px', height: '5px', borderRadius: '50%',
                          background: arr[i].color,
                          boxShadow: `0 0 6px ${arr[i].color}`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Panel body: WorkflowAnimation centred ───────── */}
          <div style={{
            padding: '32px 28px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            background: 'rgba(4, 6, 14, 0.4)',
          }}>
            <WorkflowAnimation />
          </div>

          {/* ── Panel footer: proof stats ────────────────────── */}
          <div style={{
            padding: '14px 28px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap' as const,
          }}>
            {[
              { val: '45 min', label: 'saved daily' },
              { val: '£8/mo',  label: 'running cost' },
              { val: '48 hrs', label: 'to go live' },
            ].map(s => (
              <div key={s.val} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: '3px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Flagship Content Sections — z:10 keeps them above the wave canvas */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <ProofBar />
        <DemoStrip />

        <section id="services"><Services /></section>
        <section id="how-it-works"><HowItWorks /></section>
        <section id="work"><FeaturedProject /></section>

        <Testimonials />

        <section id="pricing"><Pricing /></section>

        <About />
        <FAQ />
        <CTASection />
        <Footer />
      </div>

      <BackToTop />
      <FloatingChat />
    </main>
  );
}
