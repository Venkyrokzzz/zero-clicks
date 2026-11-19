import type { Metadata } from 'next';
import ReputationLaunch from '@/components/reputation/ReputationLaunch';
export const metadata: Metadata = {
  title: 'Discuss your venue',
  description: 'Reputation Manager by Zero Clicks helps UK hospitality venues draft, review and approve Google review replies. Your voice. Your approval. Your reputation.',
  alternates: { canonical: 'https://www.0-clicks.uk/contact' },
};
export default function Page() { return <ReputationLaunch page="contact"/>; }
