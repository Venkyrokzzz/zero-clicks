'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: '⭐',
    title: 'Review comes in',
    description: 'Any star rating, any time. Google picks it up automatically.',
    stat: '24/7',
    statLabel: 'monitoring',
    color: 'rgba(56, 189, 248, 1)',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'AI drafts the reply',
    description: 'Reads the review, writes a response in your voice. Specific, warm, human.',
    stat: '<5s',
    statLabel: 'to draft',
    color: 'rgba(192, 132, 252, 1)',
  },
  {
    number: '03',
    icon: '🚨',
    title: 'Complaints alert you',
    description: '1–2 star? You get a Telegram ping instantly. 4–5 star runs silently.',
    stat: 'instant',
    statLabel: 'for complaints',
    color: 'rgba(255, 100, 100, 1)',
  },
  {
    number: '04',
    icon: '📋',
    title: 'You paste. Done.',
    description: 'Draft is ready to copy. Tap the link, paste into Google Reviews, post.',
    stat: '30s',
    statLabel: 'your time',
    color: 'rgba(74, 222, 128, 1)',
  },
]

export default function ReputationShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="reputation-manager"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '80px 48px',
        background: 'transparent',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)',
              borderRadius: '999px', padding: '4px 14px', marginBottom: '20px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6464', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', color: '#ff9090', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Reputation Manager
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)',
              margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em',
            }}>
              Never miss a bad review.
            </h2>
            <p style={{
              color: 'var(--text-muted)', fontSize: '1rem', marginTop: '12px',
              fontFamily: 'var(--font-body)', maxWidth: '480px', lineHeight: 1.6,
            }}>
              Most pubs take 2+ days to reply to complaints. By then the damage is done.
              We reply in under 30 seconds — in your voice.
            </p>
          </div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', paddingBottom: '6px' }}>
            // 02 Product Flow
          </div>
        </motion.div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{
                background: 'rgba(12,12,16,0.8)',
                padding: '36px 32px',
                position: 'relative',
                cursor: 'default',
                transition: 'background 0.2s ease',
              }}
              whileHover={{ backgroundColor: 'rgba(20,20,28,0.95)' } as never}
            >
              {/* Step number */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                {step.number}
              </div>

              {/* Icon */}
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{step.icon}</div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: '1.1rem', color: '#f0f0f5',
                margin: '0 0 10px 0', letterSpacing: '-0.02em',
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                color: 'rgba(180,180,200,0.7)', margin: 0, lineHeight: 1.6,
              }}>
                {step.description}
              </p>

              {/* Stat */}
              <div style={{
                marginTop: '28px', paddingTop: '20px',
                borderTop: `1px solid ${step.color.replace('1)', '0.15)')}`,
                display: 'flex', alignItems: 'baseline', gap: '6px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.4rem', color: step.color, letterSpacing: '-0.03em',
                }}>
                  {step.stat}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em',
                }}>
                  {step.statLabel}
                </span>
              </div>

              {/* Connector arrow — not on last */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: '-12px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.15)', fontSize: '16px', zIndex: 2,
                  display: 'none', // hidden on mobile, shown via CSS below
                }}>
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            marginTop: '40px',
            padding: '20px 28px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: '16px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
            {[
              { val: '2,000+', label: 'UK pub reviews go unanswered monthly' },
              { val: '2 days', label: 'average response time without automation' },
              { val: '1 tap', label: 'to send a reply with Reputation Manager' },
            ].map(({ val, label }) => (
              <div key={val} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.1rem', color: '#f0f0f5',
                }}>
                  {val}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                  color: 'rgba(180,180,200,0.5)',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <a
            href="/connect"
            style={{
              fontFamily: 'var(--font-body)', fontWeight: 600,
              fontSize: '13px', color: '#000',
              background: 'white', padding: '10px 20px',
              borderRadius: '8px', textDecoration: 'none',
              whiteSpace: 'nowrap', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get started →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
