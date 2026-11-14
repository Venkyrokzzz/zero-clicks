export interface AccessProfile {
  plan: string;
  trial_ends_at?: string | null;
  trial_paused?: boolean | null;
  subscription_status?: string | null;
}
export function hasServiceAccess(profile: AccessProfile | null, now = Date.now()): boolean {
  if (!profile || profile.trial_paused) return false;
  if (profile.plan === 'trial') return !!profile.trial_ends_at && new Date(profile.trial_ends_at).getTime() > now;
  return ['founding', 'starter', 'standard', 'pro'].includes(profile.plan)
    && ['active', 'trialing'].includes(profile.subscription_status ?? '');
}
