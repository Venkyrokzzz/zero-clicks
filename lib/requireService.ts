import { supabase } from './supabase';
import { hasServiceAccess } from './entitlements';
export async function serviceAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase.from('profiles')
    .select('plan,trial_ends_at,trial_paused,subscription_status')
    .eq('clerk_user_id', userId).single();
  if (error) throw new Error('Unable to verify subscription');
  return hasServiceAccess(data);
}
