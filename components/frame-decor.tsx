"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Thin line frame that draws itself in around the viewport as the hero title
 * resolves. An outer inset rectangle plus a set of inner margin lines that
 * cross near each edge to carve out corner boxes. Each line grows from a corner
 * so the whole frame appears to be traced on.
 */
export default function FrameDecor({
  start = true,
  instant = false,
}: {
  start?: boolean;
  instant?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Collapse every line before the draw so nothing flashes at full length
  // behind the preloader.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.set(".frame-h", { scaleX: instant ? 1 : 0 });
      gsap.set(".frame-v", { scaleY: instant ? 1 : 0 });
    }, root);
    return () => ctx.revert();
  }, [instant]);

  useEffect(() => {
    if (!start || instant) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // Begin just before the title resolves so the frame is tracing itself
        // while the letterforms sharpen.
        delay: 0.7,
        defaults: { duration: 1.1, ease: "power3.inOut" },
      });

      tl.to(".frame-h", { scaleX: 1, stagger: 0.08 }, 0).to(
        ".frame-v",
        { scaleY: 1, stagger: 0.08 },
        0.12
      );
    }, root);

    return () => ctx.revert();
  }, [instant, start]);

  const line = "absolute bg-white/15";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    >
      {/* Outer inset rectangle */}
      <div className="absolute inset-3 sm:inset-[1.25rem]">
        {/* Outer frame sides — each grows from a corner */}
        <div className={`${line} frame-h left-0 top-0 h-px w-full origin-left`} />
        <div className={`${line} frame-h bottom-0 left-0 h-px w-full origin-right`} />
        <div className={`${line} frame-v left-0 top-0 h-full w-px origin-top`} />
        <div className={`${line} frame-v right-0 top-0 h-full w-px origin-bottom`} />
      </div>

      {/* Inner margin lines — span the full viewport so they run off-screen,
          crossing the outer frame to carve the corner boxes. */}
      <div className={`${line} frame-h left-0 top-[4rem] hidden h-px w-full origin-left sm:block`} />
      <div className={`${line} frame-h bottom-[4rem] left-0 hidden h-px w-full origin-right sm:block`} />
      <div className={`${line} frame-v left-[4rem] top-0 hidden h-full w-px origin-top sm:block`} />
      <div className={`${line} frame-v right-[4rem] top-0 hidden h-full w-px origin-bottom sm:block`} />
    </div>
  );
}
