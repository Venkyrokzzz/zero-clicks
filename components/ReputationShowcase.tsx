'use client'

import { useRef, ReactNode } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

const stepIcons = [
  <svg key="01" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  <svg key="02" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  <svg key="03" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  <svg key="04" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
]

const steps = [
  { number: '01', title: 'Review comes in', description: 'Any star rating, any time. Google picks it up automatically.', stat: '24/7', statLabel: 'monitoring', color: 'rgba(56, 189, 248, 1)' },
  { number: '02', title: 'AI drafts the reply', description: 'Reads the review, writes a response in your voice. Specific, warm, human.', stat: '<5s', statLabel: 'to draft', color: 'rgba(192, 132, 252, 1)' },
  { number: '03', title: 'Complaints alert you', description: '1–2 star? You get a Telegram ping instantly. 4–5 star runs silently.', stat: 'instant', statLabel: 'for complaints', color: 'rgba(255, 100, 100, 1)' },
  { number: '04', title: 'You paste. Done.', description: 'Draft is ready to copy. Tap the link, paste into Google Reviews, post.', stat: '30s', statLabel: 'your time', color: 'rgba(74, 222, 128, 1)' },
]

function StepCard({ step, icon, delay, inView }: { step: typeof steps[0], icon: ReactNode, delay: number, inView: boolean }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
      >
        <div
          style={{
            position: 'relative', borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(12,12,16,0.85)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            padding: '36px 32px', cursor: 'default',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = step.color.replace('1)', '0.3)')
            e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.5), 0 0 60px ${step.color.replace('1)', '0.06)')}`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Spotlight glow */}
          <motion.div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px',
            background: `radial-gradient(500px circle at var(--sx) var(--sy), ${step.color.replace('1)', '0.07)')}, transparent 40%)`,
            '--sx': spotlightX, '--sy': spotlightY,
          } as React.CSSProperties} />

          {/* Corner accent */}
          <div style={{
            position: 'absolute', top: '-1px', right: '-1px', width: '100px', height: '100px',
            background: `radial-gradient(circle at 100% 0%, ${step.color.replace('1)', '0.1)')}, transparent 70%)`,
            borderRadius: '0 20px 0 0', pointerEvents: 'none',
          }} />

          {/* Content with 3D lift */}
          <div style={{ transform: 'translateZ(40px)', position: 'relative', zIndex: 2 }}>
            {/* Step number */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '20px' }}>
              {step.number}
            </div>

            {/* Icon */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: step.color.replace('1)', '0.08)'),
              border: `1px solid ${step.color.replace('1)', '0.2)')}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step.color, marginBottom: '20px',
            }}>
              {icon}
            </div>

            {/* Title */}
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', color: '#f0f0f5', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
              {step.title}
            </h3>

            {/* Description */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(180,180,200,0.7)', margin: 0, lineHeight: 1.65 }}>
              {step.description}
            </p>

            {/* Stat */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${step.color.replace('1)', '0.15)')}`, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: step.color, letterSpacing: '-0.03em' }}>
                {step.stat}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                {step.statLabel}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ReputationShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="reputation-manager" style={{ borderTop: '1px solid var(--border)', padding: '80px 48px', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '999px', padding: '4px 14px', marginBottom: '20px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6464', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', color: '#ff9090', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reputation Manager</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Never miss a bad review.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '12px', fontFamily: 'var(--font-body)', maxWidth: '480px', lineHeight: 1.6 }}>
              Most pubs take 2+ days to reply to complaints. By then the damage is done.
              We reply in under 30 seconds — in your voice.
            </p>
          </div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', paddingBottom: '6px' }}>// 02 Product Flow</div>
        </motion.div>

        {/* Step Cards — 2x2 AntiGravity grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} icon={stepIcons[i]} delay={i * 0.12} inView={inView} />
          ))}
        </div>

        {/* Bottom proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ marginTop: '40px', padding: '20px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
            {[
              { val: '2,000+', label: 'UK pub reviews go unanswered monthly' },
              { val: '2 days', label: 'average response time without automation' },
              { val: '1 tap', label: 'to send a reply with Reputation Manager' },
            ].map(({ val, label }) => (
              <div key={val} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#f0f0f5' }}>{val}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(180,180,200,0.5)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
