import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import DemoHero from "@/components/DemoHero";
import DemoCommandCentre from "@/components/DemoCommandCentre";
import DemoCTA from "@/components/DemoCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo — Zero Clicks",
  description:
    "Watch the AI handle real pub complaints, bad reviews, and missed bookings — exactly like a human would. The Red Lion, Shoreditch.",
};

export default function DemoPage() {
  return (
    <main>
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <DemoHero />
      <DemoCommandCentre />
      <DemoCTA />
      <Footer />
    </main>
  );
}
