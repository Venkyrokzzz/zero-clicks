"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { isRoutineReview, type ReviewDisposition } from "@/lib/reviewDisposition";
import { ratingOnlyReply } from "@/lib/reviewDraftDefaults";
import { scenarios } from "./scenarios";
import s from "./ReputationLaunch.module.css";
import p from "./PaperDesk.module.css";

type Draft = { reply: string; source: "sample" | "ai" | "template"; disposition?: ReviewDisposition; reason?: string };
const sampleDecisions = [
  { disposition: "routine_praise", reason: "Straightforward praise", cue: "Lovely Sunday roast" },
  { disposition: "routine_reply", reason: "The guest enjoyed the roast but reported a wait", cue: "waited 40 minutes" },
  { disposition: "manager", reason: "The review describes how the team handled a complaint", cue: "made things worse" },
] as const;
const CUSTOM = scenarios.length;
const options = [...scenarios.map(({ label }) => label), "Your review"];

export default function ReviewDesk({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" } = {}) {
  const DeskHeading = headingLevel;
  const [selected, setSelected] = useState(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [customDraft, setCustomDraft] = useState<Draft>();
  const [sampleEdits, setSampleEdits] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [fold, setFold] = useState(0);
  const [direction, setDirection] = useState(1);
  const busy = useRef(false);
  const replyField = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion();
  const isCustom = selected === CUSTOM;
  const sample = scenarios[selected];
  const draft: Draft | undefined = isCustom
    ? customDraft
    : {
        reply: sampleEdits[selected] ?? sample.draft,
        source: "sample",
        ...sampleDecisions[selected],
      };

  const cue = !isCustom ? sampleDecisions[selected].cue : null;
  const cueStart = cue ? sample.review.indexOf(cue) : -1;

  function select(index: number) {
    if (index === selected) return;
    setDirection(index > selected ? 1 : -1);
    setSelected(index);
    setCopied(false);
  }

  async function copyDraft(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      replyField.current?.select();
    }
  }

  function edit(text: string) {
    setCopied(false);
    if (isCustom && customDraft)
      setCustomDraft({ ...customDraft, reply: text });
    if (!isCustom)
      setSampleEdits((current) => ({ ...current, [selected]: text }));
  }

  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    if (!review.trim()) {
      setError("");
      setCopied(false);
      setCustomDraft({ reply: ratingOnlyReply(rating), source: "template", disposition: "routine_reply", reason: "Rating only. Uses the default reply for this rating." });
      setFold(current => current + 1);
      return;
    }
    busy.current = true;
    setLoading(true);
    setCopied(false);
    setError("");
    try {
      const response = await fetch("/api/public-review-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating }),
        signal: AbortSignal.timeout(15_000),
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
      setCustomDraft({ reply: result.reply, source: result.source, disposition: result.disposition, reason: result.reason });
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
        <DeskHeading id="desk-title">Your review desk</DeskHeading>
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
              : { rotateY: direction * -19, x: direction * 10, opacity: 0.7 }
          }
          animate={{ rotateY: 0, x: 0, opacity: 1 }}
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
                maxLength={800}
                value={review}
                placeholder="The Sunday roast was lovely, but the food took a while…"
                readOnly={loading}
                onChange={(event) => {
                  setReview(event.target.value);
                  setCustomDraft(undefined);
                  setError("");
                  setCopied(false);
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
                      setCopied(false);
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
                  disabled={loading}
                >
                  {loading ? "Drafting reply…" : "Generate reply"}
                </button>
              </div>
              <p id="review-privacy" className={p.hint}>
                Leave blank to see the default for a rating. Public review text may be sent to our AI provider.
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
              <blockquote>
                {cue && cueStart >= 0 ? (
                  <>
                    {sample.review.slice(0, cueStart)}
                    <mark className={p.previewCue}>{cue}</mark>
                    {sample.review.slice(cueStart + cue.length)}
                  </>
                ) : sample.review}
              </blockquote>
              <p className={p.hint}>Sample review · The Willow Arms</p>
            </div>
          )}
          {draft?.disposition && (
            <div
              key={"decision-" + (isCustom ? fold : selected)}
              role="status"
              className={p.previewDecision}
              data-manager={draft.disposition === "manager"}
            >
              <svg viewBox="0 0 36 32" width="36" height="32" aria-hidden="true">
                <path pathLength="1" d="M5 5 Q7 22 30 21 M24 14 L31 21 L24 27" />
              </svg>
              <div>
                <strong>
                  {draft.disposition === "manager"
                    ? "Needs manager attention"
                    : isRoutineReview(draft.disposition)
                      ? "Eligible for automatic replies"
                      : "Needs attention"}
                </strong>
                {draft.reason && <p>{draft.reason}</p>}
              </div>
            </div>
          )}
          {draft && (
            <motion.div
              key={fold}
              className={p.reply}
              style={{ transformOrigin: "top center" }}
              initial={
                reduceMotion ? false : { rotateX: -12, y: 4, opacity: 0 }
              }
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.32, delay: 0.1, ease: "easeOut" }}
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
                ref={replyField}
                id="reply-draft"
                value={draft.reply}
                maxLength={4096}
                readOnly={loading}
                onChange={(event) => edit(event.target.value)}
                aria-describedby="demo-disclaimer"
              />
              <div className={p.replyActions}>
                {copied ? (
                  <span role="status">Draft copied.</span>
                ) : (
                  <span>Edit or copy your private draft.</span>
                )}
                <button
                  type="button"
                  className={p.approve}
                  disabled={!draft.reply.trim() || loading || copied}
                  onClick={() => void copyDraft(draft.reply)}
                >
                  {copied ? "Copied" : "Copy draft"}
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
