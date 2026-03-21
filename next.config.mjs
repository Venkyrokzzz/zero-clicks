// next.config.ts
// Security headers applied globally. Update CSP if you add third-party scripts.


const nextConfig = {
  // Prevent Three.js / R3F / Rapier from being bundled server-side
  serverExternalPackages: ["three", "@react-three/fiber", "@react-three/rapier", "meshline"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' blob: data:",
              "connect-src 'self' https://formspree.io",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
