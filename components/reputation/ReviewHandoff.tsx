"use client";

import { useEffect, useRef, useState } from "react";
import { classifyReview, isRoutineReview } from "@/lib/reviewDisposition";
import { reviewExamples } from "./reviewExamples";
import s from "./ReviewHandoff.module.css";

const stages = ["Guest review arrives", "V1 checks tone and risk", "V1 routes the reply"];

export default function ReviewHandoff() {
  const bench = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ index: 0, run: 0 });
  const [started, setStarted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const currentSelection = useRef(selection);
  const example = reviewExamples[selection.index];
  const review = `${example.leading}${example.praise}${example.middle}${example.concern}.`;
  const needsAttention = !isRoutineReview(classifyReview(example.rating, review).disposition);
  const activeTopic = hovered ?? pinned;

  useEffect(() => {
    const node = bench.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function select(index: number) {
    const next = { index, run: currentSelection.current.run + 1 };
    currentSelection.current = next;
    setSelection(next);
    setStarted(true);
    setHovered(null);
    setPinned(null);
    setCopyStatus("");
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(example.draft);
      if (currentSelection.current === selection) setCopyStatus("Copied draft");
    } catch {
      if (currentSelection.current === selection) setCopyStatus("Select the reply to copy it.");
    }
  }

  function highlight(text: string, topic: number, tone: string) {
    return <mark data-tone={tone} data-active={activeTopic === topic}>{text}</mark>;
  }

  return (
    <section id="review-handoff" className={s.section} aria-labelledby="review-handoff-title">
      <h2 id="review-handoff-title">How V1 handles a review</h2>
      <p className={s.intro}>Pick a guest review to see what V1 picks up, when it replies automatically, and what reaches your inbox.</p>
      <div ref={bench} className={s.workbench}>
        <div className={s.toolbar}>
          <div className={s.scenarios} role="group" aria-label="Review examples">
            {reviewExamples.map(({ label }, index) => (
              <button key={label} type="button" aria-pressed={index === selection.index} onClick={() => select(index)}>{label}</button>
            ))}
          </div>
          <button type="button" className={s.replay} onClick={() => select(selection.index)} aria-label="Replay current review scenario">Replay</button>
        </div>

        <ol key={selection.run} className={s.flow} data-animate={started} aria-label="Review workflow">
          <li className={s.review}>
            <div className={s.step}><span>1</span>{stages[0]}</div>
            <article className={s.paper} aria-label="Guest review">
              <div className={s.cardHeader}>
                <div><strong>{example.venue}</strong><small>Google Business Profile</small></div>
                <span role="img" aria-label={`${example.rating} out of 5 stars`} className={s.stars}>{"★".repeat(example.rating)}</span>
              </div>
              <blockquote>
                “{example.leading}{example.praise && highlight(example.praise, 0, "praise")}{example.middle}
                {highlight(example.concern, example.praise ? 1 : 0, needsAttention ? "risk" : example.label === "Straight praise" ? "praise" : "note") }.”
              </blockquote>
            </article>
          </li>
          <li className={s.triage}>
            <div className={s.step}><span>2</span>{stages[1]}</div>
            <div className={s.ledger}>
              <div className={s.cardHeader}>
                <span className={s.badge}>V1</span>
                <div><strong>Review triage</strong><small>{example.summary}</small></div>
              </div>
              <div className={s.signals} aria-label="Details picked up by V1">
                {example.topics.map((topic, index) => (
                  <button key={topic} type="button" aria-pressed={pinned === index} data-active={activeTopic === index}
                    onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}
                    onClick={() => setPinned(current => current === index ? null : index)}>
                    {topic}
                  </button>
                ))}
              </div>
              <p className={s.destination}>{needsAttention ? "Needs attention · Owner inbox" : "Automatic queue · Publishes on Google"}<small>{needsAttention ? "Held for approval" : "Auto-reply enabled"}</small></p>
            </div>
          </li>
          <li className={s.reply}>
            <div className={s.step}><span>3</span>{stages[2]}</div>
            <article className={s.paper} aria-label={needsAttention ? "Owner inbox private draft" : "Automatic reply preview"}>
              <div className={s.cardHeader}><div><strong>{needsAttention ? "Owner inbox" : "Google reply preview"}</strong><small>{needsAttention ? "Private draft" : "Automatic reply"}</small></div></div>
              <p className={s.replyText}>{example.draft.split(example.replyPattern).map((part, index) => index % 2 === 0 ? part :
                <mark key={index} data-tone={needsAttention ? "risk" : index === 3 && selection.index === 0 ? "note" : "praise"}
                  data-active={activeTopic === (needsAttention ? 1 : Math.floor(index / 2))}>{part}</mark>)}</p>
              <div className={s.cardFooter}>
                <button type="button" onClick={copyDraft}>{copyStatus === "Copied draft" ? copyStatus : "Copy draft"}</button>
                <strong className={s.stamp} data-attention={needsAttention}>{needsAttention ? "Needs attention" : "Auto-reply"}</strong>
              </div>
              <span className={s.feedback} role="status">{copyStatus}</span>
            </article>
          </li>
        </ol>
      </div>
      <footer className={s.footer}>
        <p>Demo only. Routine reviews auto-reply when enabled; flagged reviews wait for your approval.</p>
        <a href="#walkthrough">Try your own review <span aria-hidden="true">→</span></a>
      </footer>
    </section>
  );
}
