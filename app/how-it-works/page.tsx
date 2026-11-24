import type { Metadata } from 'next';
import ReputationLaunch from '@/components/reputation/ReputationLaunch';
export const metadata: Metadata = {
  title: 'How Reputation Manager works',
  description: 'See how Zero Clicks turns Google reviews into private drafts for UK pub and restaurant owners.',
  alternates: { canonical: 'https://www.0-clicks.uk/how-it-works' },
};
export default function Page() { return <ReputationLaunch page="process"/>; }
