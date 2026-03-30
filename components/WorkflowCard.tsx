'use client';

import { motion } from 'framer-motion';

export const WorkflowCard = () => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
    style={{
      width: '100%',
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '80px',
      padding: '32px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(24, 24, 27, 0.3)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Concentric Circle Accents */}
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />

    {/* Workflow Flow */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Input Box */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderRadius: '8px',
          background: 'rgba(39, 39, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '14px',
          color: '#d4d4d8',
        }}
      >
        Inputs
      </motion.div>

      {/* Line 1: Cyan to Purple */}
      <div
        style={{
          height: '2px',
          flex: 1,
          background: 'linear-gradient(to right, #00f2ff, #7000ff)',
          boxShadow: '0 0 10px #00f2ff',
        }}
      />

      {/* Claude AI Box */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderRadius: '8px',
          background: 'rgba(39, 39, 42, 0.8)',
          border: '1px solid rgba(112, 0, 255, 0.3)',
          fontSize: '14px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#7000ff',
          }}
        />
        Claude AI
      </motion.div>

      {/* Line 2: Purple to Orange */}
      <div
        style={{
          height: '2px',
          flex: 1,
          background: 'linear-gradient(to right, #7000ff, #ff4d4d)',
          boxShadow: '0 0 10px #ff4d4d',
        }}
      />

      {/* Output Box */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderRadius: '8px',
          background: 'rgba(39, 39, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '14px',
          color: '#d4d4d8',
        }}
      >
        Slack
      </motion.div>
    </div>
  </motion.div>
);

export default WorkflowCard;
