"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const COPY =
  "Stanford AI Club is where the students that shape the future of AI at Stanford come together. From research to industry, we offer opportunities to connect with titans of industry, learn from the best in the field, and get started in the field.";

const WORDS = COPY.split(" ");

/**
 * Short mission blurb in the top-left corner. Each word climbs up from its
 * baseline in a left-to-right ripple once the hero title has arrived, so it
 * reads as the next beat in the intro.
 */
export default function IntroText({ start = true }: { start?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Tuck each word below its baseline immediately so nothing sits at rest
  // behind the preloader before the reveal runs.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.set(".intro-word", { yPercent: 110, opacity: 0 });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!start) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".intro-word",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          // Ripple through the words so each climbs a beat after the last,
          // reading left-to-right.
          stagger: 0.035,
          // The title starts climbing at 0.9s and lands ~3s; come in on its
          // tail so this reads as the next beat.
          delay: 2.3,
        }
      );
    }, root);

    return () => ctx.revert();
  }, [start]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute bottom-0 left-[5rem] z-20 max-w-[28rem] pb-[4.5rem]"
    >
      <p className="text-sm font-medium leading-relaxed tracking-[-0.02em] text-white/70 sm:text-base">
        {WORDS.map((word, i) => (
          <span key={i}>
            <span className="intro-word inline-block align-middle will-change-transform">
              {word}
            </span>
            {i < WORDS.length - 1 ? " " : null}
          </span>
        ))}
      </p>
    </div>
  );
}
