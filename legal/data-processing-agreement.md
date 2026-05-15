# Zero Clicks — Data Processing Agreement (DPA)

**Version:** 1.0  
**Date:** May 2026

This Data Processing Agreement forms part of the Client Service Agreement between Zero Clicks and each client. It sets out how Zero Clicks processes personal data on the client's behalf.

---

## Parties

**Data Controller:** The client (the pub, restaurant, or hospitality business using Zero Clicks)

**Data Processor:** Venkatesh Surampudi trading as Zero Clicks, United Kingdom  
Email: zeroclicks.hq@gmail.com

---

## 1. What Data We Process

On your behalf as Data Controller, Zero Clicks processes:

| Category | Examples | Source |
|----------|----------|--------|
| Reviewer names | "John S.", "Sarah M." | Google Business Profile |
| Review text | Customer-written review content | Google Business Profile |
| Review ratings | Star ratings (1–5) | Google Business Profile |
| Review timestamps | Date and time of original review | Google Business Profile |
| Your business details | Name, manager name, location, tone preference | Provided by you at onboarding |
| Your login credentials | Email address, hashed password (via Clerk) | Provided by you |

We do **not** process payment card data, national insurance numbers, or sensitive personal data categories under UK GDPR Article 9.

---

## 2. Purpose of Processing

We process the above data solely to:

- Generate draft review replies in your business's voice using AI
- Present drafts in your dashboard for approval
- Post approved replies to your Google Business Profile
- Flag negative reviews for your attention
- Provide dashboard metrics (review counts, sentiment, reply status)

We will not process your data for any other purpose without your written instruction.

---

## 3. Sub-processors

Zero Clicks uses the following sub-processors to deliver the service:

| Sub-processor | Purpose | Location | Privacy Policy |
|--------------|---------|----------|----------------|
| Supabase | Database storage (reviews, profiles, settings) | EU (Ireland/France) | supabase.com/privacy |
| Vercel | Web hosting and API | EU/US (data residency: EU) | vercel.com/legal/privacy-policy |
| Anthropic (Claude API) | AI reply generation (review text passed in, no data retained) | US | anthropic.com/privacy |
| Clerk | Authentication | US | clerk.com/legal/privacy |
| Google (OAuth) | Business Profile API access | US | policies.google.com/privacy |

We will notify you of any changes to sub-processors with at least 14 days notice.

---

## 4. Data Retention

| Data type | Retention period |
|-----------|-----------------|
| Review data (text, ratings, replies) | Duration of contract + 30 days |
| Your profile and settings | Duration of contract + 30 days |
| Authentication data | Duration of contract + 30 days |
| Opt-out records | Indefinitely (legal requirement) |

On cancellation or upon your written request, all data is permanently deleted within 30 days.

---

## 5. Security Measures

Zero Clicks implements the following technical and organisational measures:

- **Encryption in transit:** All data transmitted over HTTPS/TLS 1.2+
- **Encryption at rest:** Database encrypted at rest (Supabase default)
- **Access control:** Data scoped per client via unique user ID — no client can access another's data
- **Authentication:** Multi-factor authentication available on all admin access
- **API security:** Shared-secret authentication on all webhook endpoints
- **Google tokens:** OAuth tokens stored in database, access limited to review-related API calls only

---

## 6. Your Rights as Data Controller

You may at any time:

- Request a copy of all data we hold about your business
- Request correction of inaccurate data
- Request deletion of all data (we will confirm deletion within 30 days)
- Withdraw consent for AI processing (we will revert to manual drafts only)
- Audit our processing activities upon reasonable notice

Contact: zeroclicks.hq@gmail.com

---

## 7. Breach Notification

In the event of a personal data breach affecting your data, Zero Clicks will:

- Notify you within 72 hours of becoming aware of the breach
- Provide details of: what data was affected, likely consequences, and measures taken
- Assist you in meeting your notification obligations to the ICO if required

---

## 8. Compliance

Zero Clicks processes personal data in accordance with:
- UK General Data Protection Regulation (UK GDPR)
- Data Protection Act 2018
- Privacy and Electronic Communications Regulations 2003 (PECR)

---

## 9. Acceptance

This DPA is incorporated by reference into the Client Service Agreement. By signing the Client Service Agreement, you also agree to the terms of this DPA.

---

*Zero Clicks | zeroclicks.hq@gmail.com | 0-clicks.uk*
