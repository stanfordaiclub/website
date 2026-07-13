"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A smooth circular cursor that trails the pointer with slight damping.
 * The native cursor is hidden (see globals.css, pointer: fine only).
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Center the dot on the pointer.
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    // quickTo eases toward the latest value each tick -> smooth damped follow.
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    let shown = false;
    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        // Reveal only once we know where the pointer is (avoids a corner flash).
        shown = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.25 });
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-white opacity-0 mix-blend-difference"
    />
  );
}
