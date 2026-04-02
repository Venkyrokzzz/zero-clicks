'use client';

import { motion } from 'framer-motion';

export const WorkflowCard = () => (
  <motion.div
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.5 }}
    style={{
      position: 'relative',
      zIndex: 10,
      width: '100%',
      maxWidth: '860px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '40px',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(14, 16, 28, 0.85)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(112, 0, 255, 0.08)',
      overflow: 'hidden',
    }}
  >
    {/* Terminal title bar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(255, 255, 255, 0.02)',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
      </div>
      <span
        style={{
          marginLeft: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.35)',
          fontFamily: 'var(--font-mono, "JetBrains Mono", "Fira Code", monospace)',
        }}
      >
        ~/workflows/handle-inquiry.ts
      </span>
    </div>

    {/* Workflow canvas */}
    <div
      style={{
        padding: '32px 24px',
        background: 'rgba(8, 10, 18, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px',
      }}
    >
      {/* Inputs node */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        style={{
          padding: '14px 20px',
          borderRadius: '10px',
          background: 'rgba(40, 44, 60, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '13px',
          fontWeight: 500,
          color: '#d4d4d8',
          whiteSpace: 'nowrap' as const,
          flexShrink: 0,
        }}
      >
        Inputs
      </motion.div>

      {/* Connector 1 */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minWidth: '40px' }}>
        <div style={{ height: '2px', width: '100%', background: 'linear-gradient(to right, rgba(80,80,180,0.4), rgba(140,80,255,0.7))' }} />
        <motion.div
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#a855f7',
            boxShadow: '0 0 8px #a855f7',
          }}
        />
      </div>

      {/* Claude AI node */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(30, 20, 50, 0.9)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.12)',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.9"/>
            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>Claude AI</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Classify Intent</div>
        </div>
      </motion.div>

      {/* Connector 2 */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minWidth: '40px' }}>
        <div style={{ height: '2px', width: '100%', background: 'linear-gradient(to right, rgba(140,80,255,0.7), rgba(34,197,94,0.5))' }} />
        <motion.div
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.9, repeatDelay: 0.4 }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }}
        />
      </div>

      {/* Slack node */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(15, 30, 20, 0.9)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.08)',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(74, 194, 144, 0.15)',
            border: '1px solid rgba(74, 194, 144, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          #
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>Slack</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Notify team</div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default WorkflowCard;
