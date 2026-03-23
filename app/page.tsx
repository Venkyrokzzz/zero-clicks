// app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofBar from "@/components/ProofBar";
import Services from "@/components/Services";
import N8nCanvas from "@/components/N8nCanvas";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProject from "@/components/FeaturedProject";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main>
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <ProofBar />
      <Services />
      <N8nCanvas />
      <HowItWorks />
      <FeaturedProject />
      <Testimonials />
      <Pricing />
      <About />
      <CTASection />
      <Footer />
    </main>
  );
}
