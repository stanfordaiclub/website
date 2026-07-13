"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// A 4-pointed "sparkle" star with concave sides and FLAT ends on each of the
// four tips. Coordinates are in an objectBoundingBox space (0..1) so the clip
// scales responsively with the element it masks.
//
//   - Each tip is a short flat cap (e.g. top cap runs from x=0.47 -> 0.53).
//   - Every side is a quadratic curve pulled toward the exact center (0.5,0.5),
//     which creates the deep concave "pinch" of the sparkle.
const STAR_PATH =
  "M .47 0 L .53 0 Q .5 .5 1 .47 L 1 .53 Q .5 .5 .53 1 L .47 1 Q .5 .5 0 .53 L 0 .47 Q .5 .5 .47 0 Z";

export default function StarHero({ start = true }: { start?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!start) return;
    const el = wrapRef.current;
    if (!el) return;

    // How much of the star's width to push off the left edge. 0.25 = cut off
    // 25%, leaving 75% of it visible. (0.5 would park the center on the edge and
    // cut off exactly the left half.)
    const CUT = 0.25;

    // Where the star rests after gliding left. The element starts centered
    // (center at 50vw), so to hide fraction CUT of its width past the left edge
    // we shift by -(innerWidth/2) minus the extra beyond half. (offsetWidth is
    // layout width, unaffected by the intro's transform scale.)
    const leftTarget = () =>
      -window.innerWidth / 2 - (CUT - 0.5) * el.offsetWidth;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1) Ease the star in, centered.
      tl.fromTo(
        el,
        { autoAlpha: 0, scale: 0.35, rotate: -90, x: 0 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 1.0,
          ease: "power4.out",
        }
      );

      // 2) Glide it to the left, super smoothly.
      tl.to(
        el,
        {
          x: leftTarget,
          duration: 1.6,
          ease: "power3.inOut",
        },
        "+=0.1"
      );
    }, el);

    return () => ctx.revert();
  }, [start]);

  return (
    <>
      {/* Reusable clip-path definition (normalized 0..1 space). */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id="flat-star" clipPathUnits="objectBoundingBox">
            <path d={STAR_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={wrapRef}
        style={{ opacity: 0 }}
        className="relative aspect-square w-[min(88vw,88vh)]"
      >
        <video
          className="h-full w-full object-cover"
          style={{ clipPath: "url(#flat-star)", WebkitClipPath: "url(#flat-star)" }}
          src="/star.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </>
  );
}
