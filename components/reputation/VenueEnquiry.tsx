"use client";
import { useState } from "react";
import { submitContact } from "@/lib/submitContact";
import s from "./ReputationLaunch.module.css";

export default function VenueEnquiry() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    try {
      await submitContact({
        name: String(data.get("name")),
        email: String(data.get("email")),
        company: String(data.get("company")),
        message: String(data.get("message")),
        budget: "",
      });
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error
          ? e.message
          : "Delivery could not be confirmed. Please email us directly.",
      );
    }
  }
  if (status === "success")
    return (
      <div className={s.enquirySuccess} role="status">
        <h2>Thanks for getting in touch.</h2>
        <p>
          We’ve received your enquiry. We’ll reply to the email
          address you provided.
        </p>
        <button className={s.textButton} onClick={() => setStatus("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className={s.enquiry}>
      <div className={s.formPair}>
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Email address
          <input
            name="email"
            autoComplete="email"
            type="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label>
        Venue name
        <input
          name="company"
          autoComplete="organization"
          required
          maxLength={200}
        />
      </label>
      <label>
        Tell us about your reviews
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          defaultValue="I’m interested in Reputation Manager for my venue."
        />
      </label>
      <p className={s.formNote}>
        We use these details to respond to your enquiry. Read our{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
      {status === "error" && (
        <p role="alert" className={s.formError}>
          {error}
        </p>
      )}
      <button
        type="submit"
        className={s.primary}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending enquiry…" : "Send venue enquiry"}
      </button>
      <p className={s.formNote}>
        Prefer email?{" "}
        <a href="mailto:zeroclicks.hq@gmail.com">zeroclicks.hq@gmail.com</a>
      </p>
    </form>
  );
}
