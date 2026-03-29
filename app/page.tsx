import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProofBar from "@/components/ProofBar";
import DemoStrip from "@/components/DemoStrip";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import FeaturedProject from "@/components/FeaturedProject";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProofBar />
      <DemoStrip />
      <Services />
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
