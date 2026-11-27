// next.config.mjs
// Security headers applied globally. Update CSP if you add third-party scripts.

const nextConfig = {
  // Prevent Three.js / R3F / Rapier from being bundled server-side
  serverExternalPackages: ["three", "@react-three/fiber", "@react-three/rapier", "meshline"],

  async redirects() {
    return [
      {
        source: '/call',
        destination: 'https://calendly.com/zeroclicks-hq/30min',
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking — no iframes allowed
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer info only on same-origin or HTTPS downgrade
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable unused browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS — force HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // XSS protection for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // unsafe-inline needed for theme script + Tailwind; unsafe-eval for Framer Motion
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.0-clicks.uk https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.protect.clerk.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' blob: data: https:",
              // Allow fetch to Web3Forms, Google OAuth, Clerk, Clerk Protect, and Turnstile
              "connect-src 'self' https://api.web3forms.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://clerk.0-clicks.uk https://*.clerk.accounts.dev https://clerk.com https://clerk-telemetry.com https://*.clerk-telemetry.com https://challenges.cloudflare.com https://*.protect.clerk.com:*",
              "frame-src 'self' https://accounts.google.com https://clerk.0-clicks.uk https://*.clerk.accounts.dev https://challenges.cloudflare.com https://*.protect.clerk.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
