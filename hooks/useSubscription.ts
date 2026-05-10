// hooks/useSubscription.ts — fetches plan + trial status for dashboard gating
"use client";

import { useState, useEffect } from "react";

interface Subscription {
  plan: string;
  trialEndsAt: string | null;
  daysLeft: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isPaid: boolean;
  hasAccess: boolean;
}

export function useSubscription() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription")
      .then(res => res.json())
      .then(data => setSub(data))
      .catch(() => setSub(null))
      .finally(() => setLoading(false));
  }, []);

  return { sub, loading };
}
