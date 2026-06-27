import type { Metadata } from "next";
import HowItWorksFullPage from "@/components/HowItWorksFullPage";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "How It Works — AI Review Automation for UK Pubs | Zero Clicks",
  description:
    "See how Zero Clicks automates your Google review replies in under 30 seconds. No tech knowledge needed. We build it free — you pay nothing until it's live.",
  alternates: { canonical: "https://www.0-clicks.uk/how-it-works" },
  openGraph: {
    title: "How Zero Clicks Works — AI Review Automation for UK Pubs",
    description: "From review to reply in under a minute. We build it free, you pay when it's live. Here's exactly how it works.",
    url: "https://www.0-clicks.uk/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <HowItWorksFullPage />
      <Footer />
    </>
  );
}
