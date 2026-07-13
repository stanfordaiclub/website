"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TITLE = "Stanford AI Club";
const NBSP = String.fromCharCode(160); // non-breaking space keeps word gap width

export default function SiteTitle({ start = true }: { start?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Hide the letters immediately on mount so they don't sit at rest behind the
  // preloader before their climb-in animation runs.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.set(".title-letter", { yPercent: 120, rotate: -16 });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!start) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Each letter sits in its own overflow-hidden mask and climbs up from
      // below the baseline. A small per-letter stagger offsets them one after
      // another so they arrive in sequence. Each also starts tilted and
      // straightens as it rises, so it comes in at a slight angle.
      gsap.fromTo(
        ".title-letter",
        { yPercent: 120, rotate: -16 },
        {
          yPercent: 0,
          rotate: 0,
          transformOrigin: "0% 100%",
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.075,
          // Come in while the star is almost done moving left. Star glide runs
          // 1.1s -> 2.7s (midpoint ~1.9s); start just past halfway so the text
          // climbs in as the star finishes its final approach.
          delay: 2.0,
        }
      );
    }, root);

    return () => ctx.revert();
  }, [start]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute bottom-0 right-0 z-10 pr-[1.5vw] pb-[1.5vw]"
      style={{ fontFamily: "var(--font-ciburial)" }}
    >
      <h1
        aria-label={TITLE}
        className="whitespace-nowrap text-[clamp(2.5rem,8.5vw,10rem)] font-normal leading-[0.95] tracking-[-0.05em] text-neutral-950"
      >
        {TITLE.split("").map((ch, i) => (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden px-[0.06em] -mx-[0.06em] align-bottom"
          >
            <span className="title-letter inline-block will-change-transform">
              {ch === " " ? NBSP : ch}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
