'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Hero Components
import NeuralFlow from '@/components/NeuralFlow';
import WorkflowCard from '@/components/WorkflowCard';
import MagneticButton from '@/components/MagneticButton';
import Link from 'next/link';

// Flagship Sections
const ProofBar = dynamic(() => import('@/components/ProofBar'), { ssr: false });
const DemoStrip = dynamic(() => import('@/components/DemoStrip'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { ssr: false });
const FeaturedProject = dynamic(() => import('@/components/FeaturedProject'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: false });
const About = dynamic(() => import('@/components/About'), { ssr: false });
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Home() {
  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--bg)',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          overflow: 'hidden',
        }}
      >
        <NeuralFlow />

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
              N8N · Claude AI · Built for UK SMEs
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
            <span style={{ display: 'block', color: '#ffffff', marginBottom: '8px' }}>
              You run the business.
            </span>
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(to bottom, #ffffff, #ffffff 60%, #a1a1aa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI runs everything else.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: '1.125rem',
              color: '#a1a1aa',
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '40px',
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            We build AI workflows that eliminate repetitive admin — email triage, lead routing, ops alerts, and more.
            Powered by n8n and Claude AI. Running 24/7 from day one.
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
                background: '#ffffff',
                color: '#0a0a0f',
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
                background: 'rgba(24, 24, 27, 0.5)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                transition: 'background 200ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(24, 24, 27, 0.7)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(24, 24, 27, 0.5)')}
            >
              See the demo
              <kbd style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}>⌘K</kbd>
            </Link>
          </motion.div>
        </div>

        <WorkflowCard />
      </section>

      {/* Flagship Content Sections */}
      <ProofBar />
      <DemoStrip />
      
      <section id="services">
        <Services />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="work">
        <FeaturedProject />
      </section>

      <Testimonials />

      <section id="pricing">
        <Pricing />
      </section>

      <About />
      
      <CTASection />
      
      <Footer />
    </main>
  );
}
