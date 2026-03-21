// app/contact/page.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_PAGE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zero Clicks. We'll respond within one business day.",
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
            {CONTACT_PAGE.heading}
          </h1>
          <p className="text-muted text-lg mb-14 leading-relaxed">
            {CONTACT_PAGE.subtext}
          </p>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
