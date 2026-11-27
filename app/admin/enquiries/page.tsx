"use client";

import { useEffect, useState } from "react";
import { formatDateTime, panelRequest } from "@/components/workspace/panel-data";
import s from "@/components/workspace/Workspace.module.css";

type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  email_status: keyof typeof notificationLabels;
};

const notificationLabels = {
  pending: "Email status pending",
  accepted: "Accepted by email provider",
  failed: "Email rejected",
  unconfigured: "Email sender unavailable",
  unknown: "Email delivery unconfirmed",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    panelRequest<{ enquiries: Enquiry[] }>("/api/admin/enquiries")
      .then(({ enquiries }) => { if (current) setEnquiries(enquiries); })
      .catch((failure) => { if (current) setError(failure.message); });
    return () => { current = false; };
  }, []);

  return (
    <main className={s.workspace}>
      <div className={`${s.frame} ${s.stack}`}>
        <header className={s.header}>
          <div><h1>Venue enquiries</h1><p className={s.muted}>The 50 latest enquiries submitted through Zero Clicks.</p></div>
        </header>
        {error && <p className={s.alert} role="alert">{error}</p>}
        {!error && !enquiries && <p role="status">Loading enquiries…</p>}
        {enquiries?.length === 0 && <p>No enquiries yet.</p>}
        {enquiries?.map((enquiry) => (
          <article key={enquiry.id} className={s.box}>
            <h2>{enquiry.company || enquiry.name}</h2>
            <p className={s.muted}>{enquiry.name} · {formatDateTime(enquiry.created_at)}</p>
            <p className={s.muted}>{notificationLabels[enquiry.email_status]}</p>
            {enquiry.budget && <p>Budget {enquiry.budget}</p>}
            <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{enquiry.message}</p>
            <a className={s.button} href={`mailto:${encodeURIComponent(enquiry.email)}`}>Reply to {enquiry.name}</a>
          </article>
        ))}
      </div>
    </main>
  );
}
