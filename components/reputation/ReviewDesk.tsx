"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scenarios } from "./scenarios";
import s from "./ReputationLaunch.module.css";
import p from "./PaperDesk.module.css";

type Draft = { reply: string; source: "sample" | "ai" | "template" };
const CUSTOM = scenarios.length;
const options = [...scenarios.map(({ label }) => label), "Your review"];

export default function ReviewDesk() {
  const [selected, setSelected] = useState(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [customDraft, setCustomDraft] = useState<Draft>();
  const [sampleEdits, setSampleEdits] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approved, setApproved] = useState(false);
  const [fold, setFold] = useState(0);
  const [direction, setDirection] = useState(1);
  const busy = useRef(false);
  const reduceMotion = useReducedMotion();
  const isCustom = selected === CUSTOM;
  const sample = scenarios[selected];
  const draft: Draft | undefined = isCustom
    ? customDraft
    : {
        reply: sampleEdits[selected] ?? sample.draft,
        source: "sample",
      };

  function select(index: number) {
    if (index === selected) return;
    setDirection(index > selected ? 1 : -1);
    setSelected(index);
    setApproved(false);
  }

  function edit(text: string) {
    setApproved(false);
    if (isCustom && customDraft)
      setCustomDraft({ ...customDraft, reply: text });
    if (!isCustom)
      setSampleEdits((current) => ({ ...current, [selected]: text }));
  }

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setApproved(false);
    setError("");
    try {
      const response = await fetch("/api/public-review-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating }),
        signal: AbortSignal.timeout(12_000),
      });
      const result = await response.json();
      if (
        !response.ok ||
        typeof result.reply !== "string" ||
        (result.source !== "ai" && result.source !== "template")
      ) {
        throw new Error(
          response.status === 429
            ? "The demo has reached its draft limit. Try a sample review or come back later."
            : "We couldn’t draft that reply. Please try again.",
        );
      }
      setCustomDraft({ reply: result.reply, source: result.source });
      setFold((current) => current + 1);
    } catch (failure) {
      setError(
        failure instanceof Error &&
          failure.name === "Error" &&
          failure.message.startsWith("The demo")
          ? failure.message
          : "We couldn’t draft that reply. Please try again.",
      );
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <section
      className={`${s.desk} ${p.folio}`}
      id="walkthrough"
      aria-labelledby="desk-title"
      tabIndex={-1}
    >
      <header className={`${s.deskHeader} ${p.cover}`}>
        <h2 id="desk-title">Your review desk</h2>
        <div
          className={p.scenarios}
          role="group"
          aria-label="Choose a review scenario"
        >
          {options.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={selected === index}
              onClick={() => select(index)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <div className={p.perspective}>
        <motion.div
          key={selected}
          className={p.sheet}
          style={{
            transformOrigin: direction > 0 ? "left center" : "right center",
          }}
          initial={
            reduceMotion
              ? false
              : { rotateY: direction * -14, x: direction * 8 }
          }
          animate={{ rotateY: 0, x: 0 }}
          transition={{ type: "spring", stiffness: 230, damping: 27 }}
        >
          {isCustom ? (
            <form
              className={p.form}
              onSubmit={generate}
              aria-describedby="review-privacy"
            >
              <label htmlFor="custom-review">Paste a review</label>
              <textarea
                id="custom-review"
                required
                minLength={10}
                maxLength={800}
                value={review}
                placeholder="The Sunday roast was lovely, but the food took a while…"
                readOnly={loading}
                onChange={(event) => {
                  setReview(event.target.value);
                  setCustomDraft(undefined);
                  setError("");
                  setApproved(false);
                }}
              />
              <div className={p.formControls}>
                <label htmlFor="star-rating">
                  Star rating
                  <select
                    id="star-rating"
                    value={rating}
                    disabled={loading}
                    onChange={(event) => {
                      setRating(Number(event.target.value));
                      setCustomDraft(undefined);
                      setError("");
                      setApproved(false);
                    }}
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} {value === 1 ? "star" : "stars"}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className={s.primary}
                  disabled={loading || review.trim().length < 10}
                >
                  {loading ? "Drafting reply…" : "Generate reply"}
                </button>
              </div>
              <p id="review-privacy" className={p.hint}>
                Use public review text only. It may be sent to our AI provider.
              </p>
              <div role="status" className={p.hint}>
                {loading && "Writing a reply for your review."}
              </div>
              {error && (
                <p role="alert" className={p.error}>
                  {error}
                </p>
              )}
            </form>
          ) : (
            <div className={p.example}>
              <span
                className={p.rating}
                aria-label={`${sample.rating} out of 5 stars`}
              >
                <span aria-hidden="true">
                  {"★".repeat(sample.rating)}
                  <span className={p.emptyStars}>
                    {"☆".repeat(5 - sample.rating)}
                  </span>
                </span>
              </span>
              <blockquote>{sample.review}</blockquote>
              <p className={p.hint}>Sample review · The Willow Arms</p>
            </div>
          )}
          {draft && (
            <motion.div
              key={fold}
              className={p.reply}
              style={{ transformOrigin: "top center" }}
              initial={
                reduceMotion || !isCustom ? false : { rotateX: -19, y: -5 }
              }
              animate={{ rotateX: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 205, damping: 24 }}
            >
              <div className={p.replyHead}>
                <label htmlFor="reply-draft">Reply draft</label>
                <span role="status">
                  {draft.source === "ai"
                    ? "AI draft"
                    : draft.source === "template"
                      ? "Template fallback"
                      : "Sample draft"}
                </span>
              </div>
              <textarea
                id="reply-draft"
                value={draft.reply}
                maxLength={4096}
                readOnly={loading}
                onChange={(event) => edit(event.target.value)}
                aria-describedby="demo-disclaimer"
              />
              <div className={p.replyActions}>
                {approved ? (
                  <span role="status">Approved in the demo.</span>
                ) : (
                  <span>Review and edit before approving.</span>
                )}
                <button
                  type="button"
                  className={p.approve}
                  disabled={!draft.reply.trim() || loading || approved}
                  onClick={() => setApproved(true)}
                >
                  {approved ? "Approved" : "Approve demo reply"}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      <footer className={`${s.deskFooter} ${p.note}`} id="demo-disclaimer">
        Demo only. Nothing is posted to Google.
      </footer>
    </section>
  );
}
