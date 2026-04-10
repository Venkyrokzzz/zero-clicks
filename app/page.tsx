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
const WhatWeDo = dynamic(() => import('@/components/WhatWeDo'), { ssr: false });
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 40px',
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

        <HeroPanel />
      </section>

      {/* Flagship Content Sections — z:10 keeps them above the wave canvas */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <ProofBar />
        <WhatWeDo />

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
