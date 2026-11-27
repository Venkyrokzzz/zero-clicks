import type { Metadata } from 'next';
import ReputationLaunch from '@/components/reputation/ReputationLaunch';
export const metadata: Metadata = {
  title: 'Reputation Manager pricing',
  description: 'Simple monthly plans for UK hospitality venues: Founding Member (£35/month with no setup fee) and Standard (£55/month + £499 guided setup).',
  alternates: { canonical: 'https://www.0-clicks.uk/pricing' },
};
export default function Page() { return <ReputationLaunch page="pricing"/>; }
