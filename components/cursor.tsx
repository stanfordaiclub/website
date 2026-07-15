"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const R = 46; // circle radius in the 100x100 viewBox
const CIRC = 2 * Math.PI * R;

/**
 * Custom pointer. The native cursor is left alone while the loading screen is
 * up; ~2s after it clears, the custom cursor takes over. Over anything marked
 * `[data-video-cursor]` (the hero video) it blooms into a large ring — the
 * circle draws itself and the arrow expands out — and reverses that same
 * animation back to the dot when you leave. Native cursor hidden via globals.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGGElement>(null);
  const [video, setVideo] = useState(false);
  const readyRef = useRef(false);

  // Smooth position follow — armed only after the hand-off.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const last = { x: -100, y: -100 };
    let hasPos = false;
    let shown = false;

    const reveal = () => {
      if (shown) return;
      shown = true;
      gsap.to(el, { autoAlpha: 1, duration: 0.3 });
    };
    const move = (e: MouseEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      hasPos = true;
      if (readyRef.current) {
        xTo(e.clientX);
        yTo(e.clientY);
        reveal();
      }
    };
    const over = (e: MouseEvent) => {
      if (!readyRef.current) return;
      const target = e.target as HTMLElement | null;
      setVideo(!!target?.closest("[data-video-cursor]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    const activate = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      document.documentElement.classList.add("cursor-ready");
      if (hasPos) {
        gsap.set(el, { x: last.x, y: last.y });
        reveal();
      }
    };

    // Native cursor stays while the loading screen is up; the instant it
    // clears, hand off to the custom cursor. No loading screen (subpage /
    // repeat visit) -> take over right away.
    if (document.documentElement.classList.contains("is-loading")) {
      window.addEventListener("saic:loaded", activate, { once: true });
    } else {
      activate();
    }

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("saic:loaded", activate);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, []);

  // Bloom-in / reverse-out whenever the mode flips.
  useEffect(() => {
    const dot = dotRef.current;
    const svg = svgRef.current;
    const circle = circleRef.current;
    const arrow = arrowRef.current;
    if (!dot || !svg || !circle || !arrow) return;

    gsap.killTweensOf([dot, svg, circle, arrow]);
    gsap.set(circle, { strokeDasharray: CIRC });

    if (video) {
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.15, ease: "power2.in" });
      gsap.set(svg, { autoAlpha: 1 });
      // Circle traces itself from the top; arrow expands out with overshoot.
      gsap.fromTo(
        circle,
        { strokeDashoffset: CIRC },
        { strokeDashoffset: 0, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        arrow,
        { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" },
        { scale: 1, opacity: 1, duration: 0.45, delay: 0.12, ease: "back.out(2)" }
      );
    } else {
      // Reverse of the bloom: the arrow retracts and the circle un-draws, then
      // the dot returns — the same animation played backwards.
      gsap.to(arrow, {
        scale: 0.2,
        opacity: 0,
        transformOrigin: "50% 50%",
        duration: 0.28,
        ease: "power2.in",
      });
      gsap.to(circle, {
        strokeDashoffset: CIRC,
        duration: 0.42,
        ease: "power2.inOut",
        onComplete: () => gsap.set(svg, { autoAlpha: 0 }),
      });
      gsap.to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        delay: 0.26,
        ease: "power3.out",
      });
    }
  }, [video]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center opacity-0 ${
        // Difference blend keeps the dot visible on any background; drop it over
        // the video so the ring stays plain white.
        video ? "" : "mix-blend-difference"
      }`}
    >
      {/* Plain dot for the default state; GSAP crossfades it with the ring. */}
      <div ref={dotRef} className="h-3 w-3 rounded-full bg-white" />

      {/* Ring + arrow for the video state; drawn by GSAP. */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        fill="none"
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"
      >
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r={R}
          stroke="white"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          transform="rotate(-90 50 50)"
        />
        <g
          ref={arrowRef}
          stroke="white"
          strokeWidth={1.25}
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path d="M36 64 64 36" vectorEffect="non-scaling-stroke" />
          <path d="M42 36 H64 V58" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  );
}
