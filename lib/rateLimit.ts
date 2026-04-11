// lib/rateLimit.ts
// Simple in-memory rate limiter. Resets on each server restart / cold start.
// For production scale, swap the Map for a Redis store (e.g. Upstash).

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(
  ip: string,
  max = 5,
  windowMs = WINDOW_MS
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${ip}:${max}:${windowMs}`;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

// Periodically prune stale entries so the Map doesn't grow unboundedly
setInterval(() => {
  const now = Date.now();
  store.forEach((val, key) => {
    if (now > val.resetAt) store.delete(key);
  });
}, WINDOW_MS);
