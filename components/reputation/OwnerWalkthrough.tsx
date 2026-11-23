"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { classifyReview } from "@/lib/reviewDisposition";
import { scenarios } from "./scenarios";
import s from "./OwnerWalkthrough.module.css";

const destinations = [
  { image: "/hospitality-review-hero.jpg", method: "V1 uses the default five-star thank-you.", reason: "The owner can check, edit or copy the wording." },
  { image: "/pilot-mixed.jpg", method: "V1 acknowledges the roast and apologises for the wait.", reason: "The owner checks both parts before using the draft." },
  { image: "/pilot-manager.jpg", method: "V1 addresses how the guest was treated and invites private follow-up.", reason: "The duty manager checks the wording and decides how to follow up." },
];
const shots = ["Review arrives", "V1 drafts", "Owner checks"] as const;
const durations = [4200, 6200, 4400] as const;

export default function OwnerWalkthrough() {
  const [scenario, setScenario] = useState(0);
  const [shot, setShot] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const elapsed = useRef(0);
  const startedAt = useRef(0);
  const review = scenarios[scenario];
  const destination = destinations[scenario];
  const decision = classifyReview(review.rating, review.review);
  const inbox = { routine_praise: "Routine drafts", approval: "Needs attention", manager: "Needs attention · Manager review" }[decision.disposition];

  useEffect(() => {
    if (!playing) return;
    startedAt.current = performance.now();
    const timer = window.setTimeout(() => {
      elapsed.current = 0;
      if (shot === shots.length - 1) {
        setPlaying(false);
        setFinished(true);
      } else {
        setShot(shot + 1);
      }
    }, Math.max(0, durations[shot] - elapsed.current));
    return () => window.clearTimeout(timer);
  }, [playing, shot, scenario]);

  function select(nextScenario: number, nextShot: number) {
    elapsed.current = 0;
    setScenario(nextScenario);
    setShot(nextShot);
    setPlaying(false);
    setFinished(false);
  }

  function togglePlayback() {
    if (playing) elapsed.current += performance.now() - startedAt.current;
    if (finished) setShot(0);
    setFinished(false);
    setPlaying(!playing);
  }

  return (
    <section id="owner-walkthrough" className={s.scene} aria-labelledby="owner-walkthrough-title">
      <div className={s.heading}>
        <h2 id="owner-walkthrough-title">From the review to your inbox.</h2>
        <div className={s.scenarios} role="group" aria-label="Choose a review scenario">
          {scenarios.map(({ label }, index) => (
            <button key={label} type="button" aria-pressed={scenario === index} onClick={() => select(index, 0)}>{label}</button>
          ))}
        </div>
      </div>
      <div className={s.frame} data-shot={shot}>
        <div className={s.still} aria-hidden="true">
          {destinations.map(({ image }, index) => (
            <Image key={image} src={image} alt="" fill sizes="(max-width: 760px) 100vw, 1130px"
              unoptimized className={s.photo} priority={index === 0} data-active={(shot === 2 ? 2 : scenario) === index} />
          ))}
        </div>
        <div aria-live={playing ? "off" : "polite"} className={s.caption}>
          <div key={scenario + "-" + shot} className={s.card}>
            <span className={s.status}>{["Google Business Profile", "Private reply draft", "Owner inbox"][shot]}</span>
            <strong>{[review.rating + (review.rating === 1 ? " star" : " stars"), "Reply draft", inbox][shot]}</strong>
            {shot === 2 ? <p>{destination.reason}</p> : <blockquote>{shot === 0 ? review.review : review.draft}</blockquote>}
            {shot === 1 && <p>{destination.method}</p>}
            {shot === 2 && <p className={s.privateNote}>Saved privately. Nothing is posted to Google.</p>}
          </div>
        </div>
      </div>
      <div className={s.controls}>
        <button className={s.play} type="button" onClick={togglePlayback}>
          <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
          {playing ? "Pause" : finished ? "Replay" : "Play"} walkthrough
        </button>
        <div className={s.shots} role="group" aria-label="Choose a walkthrough step">
          {shots.map((label, index) => (
            <button key={label} type="button" aria-pressed={shot === index} onClick={() => select(scenario, index)}>
              {label}
              <span className={s.track} aria-hidden="true">
                {shot === index && <span key={scenario + "-" + shot} className={s.progress} style={{ animationDuration: durations[shot] + "ms", animationPlayState: playing ? "running" : "paused" }} />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
