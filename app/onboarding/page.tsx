"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import s from "@/components/workspace/Workspace.module.css";

const fields = [
  { name: "business_name", label: "Venue name", autoComplete: "organization" },
  { name: "manager_name", label: "Your name", autoComplete: "name" },
  { name: "location", label: "Town or city", autoComplete: "address-level2" },
  { name: "postcode", label: "Postcode", autoComplete: "postal-code" },
  { name: "phone", label: "Phone number", autoComplete: "tel", type: "tel" },
] as const;

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function saveVenue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const details = Object.fromEntries(
      Array.from(new FormData(event.currentTarget), ([key, value]) => [key, String(value).trim()]),
    );
    if (Object.values(details).some(value => !value)) {
      setError("Fill in each field to continue.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.error || "Could not save your venue details. Try again.");
      }
      window.location.assign("/start");
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== "TimeoutError" ? failure.message : "Saving timed out. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className={s.workspace}>
      <div className={`${s.compact} ${s.stack}`}>
        <header className={s.header}>
          <div>
            <h1>Set up your venue</h1>
            <p className={s.muted}>Save your venue details, then connect the Google Business Profile you manage.</p>
          </div>
        </header>
        <ol className={s.setupSteps} aria-label="Venue setup steps">
          <li aria-current="step">Venue details</li>
          <li>Connect Google</li>
          <li>Review inbox</li>
        </ol>
        <form className={`${s.box} ${s.stack}`} onSubmit={saveVenue} aria-busy={loading}>
          <div className={s.fieldGrid}>
            {fields.map(field => (
              <label key={field.name}>
                {field.label}
                <input className={s.input} name={field.name} type={"type" in field ? field.type : "text"} autoComplete={field.autoComplete} required />
              </label>
            ))}
            <label>
              Business type
              <select className={s.input} name="business_type" defaultValue="" required>
                <option value="" disabled>Choose a type</option>
                <option value="pub">Pub</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Café</option>
                <option value="hotel">Hotel</option>
              </select>
            </label>
          </div>
          {error && <p role="alert" className={s.alert}>{error}</p>}
          <div className={s.row}>
            <button className={s.primary} type="submit" disabled={loading}>
              {loading ? "Saving venue…" : "Save and continue"}
            </button>
            <Link href="/dashboard" className={s.button}>Back to workspace</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
