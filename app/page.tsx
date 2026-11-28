import type { Metadata } from 'next';
import ReputationLaunch from '@/components/reputation/ReputationLaunch';
export const metadata: Metadata = {
  title: 'Reputation Manager — Zero Clicks',
  description: 'Automatically reply to routine Google reviews for UK pubs and restaurants. Flagged and sensitive reviews stay private for your approval.',
  alternates: { canonical: 'https://www.0-clicks.uk/' },
};
export default function Page() { return <ReputationLaunch page="home"/>; }
