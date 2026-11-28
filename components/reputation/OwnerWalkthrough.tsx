"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { classifyReview } from "@/lib/reviewDisposition";
import { scenarios } from "./scenarios";
import s from "./OwnerWalkthrough.module.css";

// Read the review, read the proposed reply, then see where it lands.
const storyboard = [
  { label: "Google review", holdMs: 4200 },
  { label: "Reply draft", holdMs: 6200 },
  { label: "Owner inbox", holdMs: 4400 },
] as const;
const stills = ["/hospitality-review-hero.jpg", "/pilot-mixed.jpg", "/pilot-manager.jpg"] as const;
type Playback = "ready" | "playing" | "paused" | "finished";

export default function OwnerWalkthrough({ standalone = false }: { standalone?: boolean }) {
  const [scenario, setScenario] = useState(0);
  const [shot, setShot] = useState(0);
  const [playback, setPlayback] = useState<Playback>("ready");
  const [autoCut, setAutoCut] = useState(false);
  const remaining = useRef(0);
  const startedAt = useRef(0);
  const review = scenarios[scenario];
  const decision = classifyReview(review.rating, review.review);
  const inbox = { routine_praise: "Automatic queue", routine_reply: "Automatic queue", approval: "Needs attention", manager: "Manager review" }[decision.disposition];
  const playing = playback === "playing";
  const holdMs = storyboard[shot].holdMs;
  const Heading = standalone ? "h1" : "h2";

  useEffect(() => {
    if (!playing) return;
    startedAt.current = performance.now();
    const timer = window.setTimeout(() => {
      if (shot === storyboard.length - 1) {
        setPlayback("finished");
        return;
      }
      remaining.current = storyboard[shot + 1].holdMs;
      setAutoCut(true);
      setShot(shot + 1);
    }, remaining.current);
    return () => window.clearTimeout(timer);
  }, [playing, shot]);

  function select(nextScenario: number, nextShot: number) {
    setAutoCut(false);
    setScenario(nextScenario);
    setShot(nextShot);
    setPlayback("ready");
  }

  function togglePlayback() {
    if (playing) {
      remaining.current = Math.max(0, remaining.current - (performance.now() - startedAt.current));
      setPlayback("paused");
      return;
    }
    if (playback === "finished") {
      setAutoCut(false);
      setShot(0);
      remaining.current = storyboard[0].holdMs;
    } else if (playback === "ready") {
      remaining.current = holdMs;
    }
    setPlayback("playing");
  }

  return (
    <section id="owner-walkthrough" className={s.scene} data-standalone={standalone} aria-labelledby="owner-walkthrough-title">
      <header className={s.heading}>
        <Heading id="owner-walkthrough-title">From Google review to reply</Heading>
        <div className={s.scenarios} role="group" aria-label="Choose a sample review">
          {scenarios.map(({ label }, index) => (
            <button key={label} type="button" aria-pressed={scenario === index} onClick={() => select(index, 0)}>{label}</button>
          ))}
        </div>
      </header>

      <div className={s.frame}>
        <div className={s.still} aria-hidden="true">
          {stills.map((image, index) => (
            <Image key={image} src={image} alt="" fill sizes="(max-width: 700px) 100vw, 640px"
              unoptimized className={s.photo} priority={standalone && index === 0}
              data-active={(shot === 2 ? 2 : scenario) === index} />
          ))}
        </div>
        <div className={s.tray} aria-live={playing ? "off" : "polite"} aria-atomic="true">
          <div key={scenario + "-" + shot} className={s.slip} data-enter={autoCut}>
            <div className={s.slipHeader}>
              <span>{storyboard[shot].label}</span>
              <span role="img" aria-label={review.rating + " out of 5 stars"}>{review.rating}/5 <span aria-hidden="true">★</span></span>
            </div>
            {shot === 2 ? (
              <>
                <strong className={s.destination} data-manager={decision.disposition === "manager"}>{inbox}</strong>
                <p>{inbox === "Automatic queue" ? "Publishes on Google when automatic replies are enabled." : decision.reason}</p>
                <blockquote className={s.inboxDraft}>{review.draft}</blockquote>
              </>
            ) : (
              <>
                <blockquote>{shot === 0 ? review.review : review.draft}</blockquote>
                {shot === 1 && <p>{"Reply based on the guest’s feedback"}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={s.controls}>
        <button className={s.play} type="button" onClick={togglePlayback}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            {playing ? <path d="M4 3h2v10H4zm6 0h2v10h-2z" /> : <path d="M5 3v10l8-5z" />}
          </svg>
          {playing ? "Pause" : playback === "paused" ? "Resume" : playback === "finished" ? "Replay" : "Play"}
        </button>
        <div className={s.shots} role="group" aria-label="Choose a walkthrough step">
          {storyboard.map(({ label }, index) => (
            <button key={label} type="button" aria-current={shot === index ? "step" : undefined}
              onClick={() => select(scenario, index)}>
              {label}
              <span className={s.track} aria-hidden="true" data-complete={index < shot || playback === "finished"}>
                {shot === index && (playing || playback === "paused") && (
                  <span className={s.progress} style={{ animationDuration: holdMs + "ms", animationPlayState: playing ? "running" : "paused" }} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      <footer className={s.footer}>
        <p>Routine replies can auto-publish when you opt in. Flagged reviews wait for your approval.</p>
        {standalone && <Link href="/demo">Try your own review <span aria-hidden="true">→</span></Link>}
      </footer>
    </section>
  );
}
