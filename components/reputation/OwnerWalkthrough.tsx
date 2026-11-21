"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import s from "./OwnerWalkthrough.module.css";

const steps = [
  { label: "Review arrives", text: "Lovely Sunday roast. The team made us feel right at home." },
  { label: "A draft is ready", text: "Glad you felt at home with us on Sunday. It’s lovely to hear you enjoyed the roast." },
  { label: "Owner approves", text: "The owner checks the wording, then queues the reply for Google." },
] as const;

export default function OwnerWalkthrough() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const atEnd = step === steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setStep(step + 1);
      if (step + 1 === steps.length - 1) setPlaying(false);
    }, 3100);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  return (
    <section id="owner-walkthrough" className={s.scene} aria-labelledby="owner-walkthrough-title">
      <header className={s.header}>
        <h2 id="owner-walkthrough-title">A reply between shifts.</h2>
        <button type="button" onClick={() => {
          if (atEnd) setStep(0);
          setPlaying(!playing);
        }}>
          {playing ? "Pause walkthrough" : atEnd ? "Replay walkthrough" : "Play walkthrough"}
        </button>
      </header>
      <div className={s.frame}>
        <Image src="/pub-owner-review.jpg" alt="Illustration of a pub owner sitting at the bar and reading her phone"
          width={1200} height={800} unoptimized className={s.owner} data-playing={playing} />
        <div className={s.card} key={step} data-step={step} aria-live="polite">
          <strong>{steps[step].label}</strong>
          <p>{steps[step].text}</p>
        </div>
      </div>
      <div className={s.steps} role="group" aria-label="Walkthrough steps">
        {steps.map(({ label }, index) => (
          <button key={label} type="button" aria-pressed={step === index} onClick={() => {
            setPlaying(false);
            setStep(index);
          }}>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
