import type { Metadata } from 'next';
import ReputationLaunch from '@/components/reputation/ReputationLaunch';
export const metadata: Metadata = {
  title: 'Try Reputation Manager',
  description: 'Try Reputation Manager live with sample pub reviews or paste your own review to see how Zero Clicks triages complaints and drafts replies.',
  alternates: { canonical: 'https://www.0-clicks.uk/demo' },
};
export default function Page() { return <ReputationLaunch page="demo"/>; }
