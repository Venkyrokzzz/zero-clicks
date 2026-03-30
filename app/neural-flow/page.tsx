'use client';

import { motion } from 'framer-motion';
import NeuralFlow from '@/components/NeuralFlow';
import WorkflowCard from '@/components/WorkflowCard';
import MagneticButton from '@/components/MagneticButton';
import Link from 'next/link';

export default function NeuralFlowPage() {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '16px',
        paddingRight: '16px',
        overflow: 'hidden',
      }}
    >
      <NeuralFlow />

      {/* Hero Content */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 10,
          maxWidth: '960px',
        }}
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-block',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '4px',
            paddingBottom: '4px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
          }}
        >
          n8n • Claude AI • Built for UK SMEs
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
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
          <span
            style={{
              display: 'block',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              marginBottom: '8px',
              color: '#ffffff',
            }}
          >
            You run the business.
          </span>
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(to bottom, #ffffff, #ffffff 60%, #71717a)',
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
          initial={{ opacity: 0 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <MagneticButton>Book a free 30-min call</MagneticButton>

          <Link
            href="/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '16px',
              paddingBottom: '16px',
              background: 'rgba(24, 24, 27, 0.5)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(24, 24, 27, 0.7)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(24, 24, 27, 0.5)';
            }}
          >
            See the demo
          </Link>
        </motion.div>
      </div>

      {/* Workflow Card */}
      <WorkflowCard />
    </main>
  );
}
