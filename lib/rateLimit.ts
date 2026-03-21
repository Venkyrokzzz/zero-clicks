// lib/rateLimit.ts
// Simple in-memory rate limiter. Resets on each server restart / cold start.
// For production scale, swap the Map for a Redis store (e.g. Upstash).

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — reset
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

// Periodically prune stale entries so the Map doesn't grow unboundedly
setInterval(() => {
  const now = Date.now();
  store.forEach((val, key) => {
    if (now > val.resetAt) store.delete(key);
  });
}, WINDOW_MS);
