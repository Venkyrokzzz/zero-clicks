import type { Metadata } from 'next';
import ReputationLaunch from '@/components/reputation/ReputationLaunch';
export const metadata: Metadata = {
  title: 'Discuss your venue',
  description: 'Book a 15-minute call or send your venue details to see how Zero Clicks Reputation Manager handles your Google reviews.',
  alternates: { canonical: 'https://www.0-clicks.uk/contact' },
};
export default function Page() { return <ReputationLaunch page="contact"/>; }
