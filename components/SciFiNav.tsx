'use client';

import React from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Services', href: '#services', id: '01' },
  { name: 'Reputation Manager', href: '#reputation-manager', id: '02' },
  { name: 'Process', href: '#how-it-works', id: '03' },
  { name: 'Pricing', href: '#pricing', id: '04' },
];

const SciFiNav = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.5 }}
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(24, 24, 27, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Active Node Indicator */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#ff4d4d',
          boxShadow: '0 0 8px #ff4d4d',
          marginRight: '8px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />

      {navLinks.map((link) => (
        <motion.a
          key={link.id}
          href={link.href}
          whileHover={{ scale: 1.05, y: -2 }}
          style={{
            position: 'relative',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#a1a1aa';
          }}
        >
          {/* Tactical ID Label */}
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              fontSize: '6px',
              color: '#00f2ff',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
            }}
            className="nav-id"
          >
            {link.id}
          </span>

          {link.name}

          {/* Data-Link Underline */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '1px',
              background: 'linear-gradient(to right, transparent, #ff4d4d, transparent)',
              width: '0%',
              transition: 'width 0.5s ease',
            }}
            className="nav-underline"
          />
        </motion.a>
      ))}

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 77, 77, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginLeft: '16px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '8px',
          paddingBottom: '8px',
          borderRadius: '9999px',
          background: '#ff4d4d',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '-0.025em',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        Book call
      </motion.button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        nav a:hover .nav-id {
          opacity: 1;
        }

        nav a:hover .nav-underline {
          width: 100%;
        }
      `}</style>
    </motion.nav>
  );
};

export default SciFiNav;
