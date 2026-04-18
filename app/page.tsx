'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Hero Components
import HeroPanel from '@/components/HeroPanel';
import MagneticButton from '@/components/MagneticButton';
import Link from 'next/link';
import { HERO } from '@/lib/content';

const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });

// Flagship Sections
const ProofBar = dynamic(() => import('@/components/ProofBar'), { ssr: false });
const ProblemStats = dynamic(() => import('@/components/ProblemStats'), { ssr: false });
const WhatWeDo = dynamic(() => import('@/components/WhatWeDo'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const ReputationShowcase = dynamic(() => import('@/components/ReputationShowcase'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '120px 16px 60px',
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(16,185,129,0.25)',
              background: 'rgba(16,185,129,0.06)',
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}
            />
            <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#10b981', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              AI-powered review replies for UK hospitality
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 'clamp(2.6rem, 7.5vw, 4.8rem)',
              fontWeight: 800,
              marginTop: '28px',
              marginBottom: '0',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
            }}
          >
            <span style={{ display: 'block' }} className="hero-heading">
              {HERO.headlineTop}
            </span>
            <span className="hero-heading" style={{ display: 'block', opacity: 0.5 }}>
              {HERO.headlineBottom}
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.1rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '560px',
              margin: '20px auto 36px',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
            }}
          >
            {HERO.subtext}
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
            {/* Primary CTA */}
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: '#2c4fd6',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                borderRadius: '8px',
                boxShadow: '0 0 32px rgba(44,79,214,0.35)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-1px)';
                el.style.boxShadow = '0 0 40px rgba(44,79,214,0.5)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 0 32px rgba(44,79,214,0.35)';
              }}
            >
              Get a free sample reply
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 22px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'color 150ms ease, border-color 150ms ease',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'rgba(255,255,255,0.9)';
                el.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = 'rgba(255,255,255,0.6)';
                el.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              See it in action →
            </Link>
          </motion.div>
        </div>

        <HeroPanel />
      </section>

      {/* Flagship Content Sections — z:10 keeps them above the wave canvas */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <ProofBar />
        <ProblemStats />
        <WhatWeDo />

        <Testimonials />

        <section id="pricing"><Pricing /></section>
        <section id="reputation-manager"><ReputationShowcase /></section>
        <section id="how-it-works"><HowItWorks /></section>

        <FAQ />
        <CTASection />
        <Footer />
      </div>

      <BackToTop />
      <FloatingChat />
    </main>
  );
}
