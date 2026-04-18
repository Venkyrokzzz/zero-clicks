// components/JsonLd.tsx — Organisation + WebSite structured data
const BASE = "https://www.0-clicks.uk";

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#organisation`,
      name: "Zero Clicks",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "zeroclicks.hq@gmail.com",
        availableLanguage: "English",
      },
      sameAs: [
        "https://linkedin.com/in/venkatesh-surampudi-b51323379",
        "https://x.com/venkatesh_n8n",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "Zero Clicks",
      description: "AI automation for UK pubs, restaurants and hotels.",
      publisher: { "@id": `${BASE}/#organisation` },
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
