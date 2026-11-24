"use client";

import { useEffect, useRef, useState } from "react";
import { classifyReview } from "@/lib/reviewDisposition";
import { reviewExamples } from "./reviewExamples";
import s from "./ReviewHandoff.module.css";

export default function ReviewHandoff() {
  const flow = useRef<HTMLDivElement>(null);
  const [scenario, setScenario] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [showImmediately, setShowImmediately] = useState(false);

  useEffect(() => {
    if (!flow.current || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setStarted(true);
    }, { rootMargin: "0px 0px -15% 0px" });
    observer.observe(flow.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const running = playing && visible && pageVisible;
  const example = reviewExamples[scenario];
  const review = example.leading + example.praise + example.middle + example.concern;
  const needsAttention = classifyReview(example.rating, review).disposition === "manager";

  function select(index: number) {
    setShowImmediately(!playing);
    setScenario(index);
  }

  function advance() {
    setShowImmediately(false);
    setScenario(current => (current + 1) % reviewExamples.length);
  }

  return (
    <section id="review-handoff" className={s.section} aria-labelledby="review-handoff-title">
      <h2 id="review-handoff-title">How V1 handles a review</h2>
      <p className={s.intro}>A guest leaves a review. V1 picks up the details and prepares a private reply.</p>

      <div ref={flow} data-running={running} className={s.demo}>
        <div className={s.toolbar}>
          <div className={s.scenarios} role="group" aria-label="Review examples">
            {reviewExamples.map(({ label }, index) => (
              <button key={label} type="button" aria-pressed={index === scenario} onClick={() => select(index)}>
                {label}
                {index === scenario && started && (
                  <span key={scenario} className={s.progress} aria-hidden="true" onAnimationEnd={advance} />
                )}
              </button>
            ))}
          </div>
          <button className={s.playback} type="button" onClick={() => setPlaying(current => !current)}>
            {playing ? "Pause rotation" : "Resume rotation"}
          </button>
        </div>

        <ol key={scenario} className={s.flow} data-animate={started && !showImmediately} aria-label="From Google review to private draft">
          <li className={s.input}>
            <div className={s.paper}>
              <h3>Google review</h3>
              <p className={s.stars} role="img" aria-label={`${example.rating} out of 5 stars`}>
                {"★".repeat(example.rating)}{"☆".repeat(5 - example.rating)}
              </p>
              <blockquote>
                “{example.leading}{example.praise && <mark className={s.praise}>{example.praise}</mark>}
                {example.middle}{example.concern && <mark className={s.comment}>{example.concern}</mark>}.”
              </blockquote>
            </div>
          </li>
          <li className={s.process}>
            <span className={s.route} aria-hidden="true" />
            <div className={s.v1}>
              <h3><span>V1</span> Review Replier</h3>
              <div className={s.topics}>
                <span className={s.praise}>{example.topics[0]}</span>
                <span className={s.comment}>{example.topics[1]}</span>
              </div>
            </div>
          </li>
          <li className={s.output}>
            <span className={s.route} aria-hidden="true" />
            <div className={s.paper}>
              <h3>Owner inbox · Private draft</h3>
              <blockquote>
                {example.draft.split(/(atmosphere|service)/g).map((part, index) => index % 2 === 0
                  ? part
                  : <mark key={index} className={part === "atmosphere" ? s.praise : s.comment}>{part}</mark>
                )}
              </blockquote>
              <strong className={s.stamp} data-attention={needsAttention}>
                {needsAttention ? "Needs attention" : "Routine draft"}
              </strong>
            </div>
          </li>
        </ol>
      </div>
      <footer className={s.footer}>
        <p>V1 flags serious concerns even at five stars. You decide what goes on Google.</p>
        <a href="#walkthrough">Try your own review</a>
      </footer>
    </section>
  );
}
