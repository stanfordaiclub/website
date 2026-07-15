"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { SPEAKERS, type Speaker } from "@/lib/speakers";
import BackLink from "@/components/back-link";

const NBSP = String.fromCharCode(160); // keeps the word gap width in the title

/**
 * Large heading whose letters each climb up from below their baseline while
 * straightening out of a slight tilt — the same slow, angled reveal as the
 * landing page's "Stanford AI Club" title.
 */
function AnimatedTitle({ text }: { text: string }) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
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
          delay: 0.15,
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={rootRef}
      aria-label={text}
      className="mt-8 whitespace-nowrap text-6xl font-medium leading-[0.95] tracking-tight text-white sm:text-8xl"
    >
      {text.split("").map((ch, i) => (
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
  );
}

/** Group speakers by academic year, newest year first. */
function byYear(speakers: Speaker[]) {
  const groups = new Map<string, Speaker[]>();
  for (const s of speakers) {
    const list = groups.get(s.year) ?? [];
    list.push(s);
    groups.set(s.year, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, list]) => ({
      year,
      // Within a year, dated talks come first (most recent first); undated last.
      list: [...list].sort((a, b) => {
        if (a.date && b.date) return b.date.localeCompare(a.date);
        if (a.date) return -1;
        if (b.date) return 1;
        return 0;
      }),
    }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

// The title's letters finish climbing in around here; the list cascades in
// right after so it reads as the next beat.
const LIST_START = 1.7;
const STEP = 0.06;

export default function SpeakersPage() {
  const groups = byYear(SPEAKERS);

  // Assign each heading and row a running order index so they reveal one after
  // another in a single smooth cascade.
  let order = 0;
  const sequence = groups.map(({ year, list }) => ({
    year,
    yearIndex: order++,
    rows: list.map((s) => ({ speaker: s, index: order++ })),
  }));

  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="md:grid md:grid-cols-2">
        {/* Left half — a full-height background video (a different clip from the
            landing page). Sticky so it stays in view while the speakers scroll.
            Hidden on small screens where the split can't breathe. */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 h-dvh overflow-hidden bg-black">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
            >
              {/* WebM (VP9) first — smaller for modern browsers; MP4 fallback. */}
              <source src="/speakers.webm" type="video/webm" />
              <source src="/speakers.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Back — a crisp chevron over the top-left of the video. */}
            <BackLink className="absolute left-6 top-6 z-10 text-white lg:left-8 lg:top-8" />
          </div>
        </div>

        {/* Right half — the full speakers list. */}
        <div className="px-6 pb-24 pt-16 sm:pt-20 md:px-10 lg:px-14">
          {/* Mobile back — the video (and its chevron) is hidden on small
              screens, so surface a chevron at the top-left of the list. */}
          <BackLink className="mb-6 text-white md:hidden" />

          <AnimatedTitle text="Speakers" />

          <div className="mt-16 flex flex-col gap-14">
            {sequence.map(({ year, yearIndex, rows }) => (
              <section key={year} className="flex flex-col gap-6">
                <motion.h2
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: LIST_START + yearIndex * STEP,
                  }}
                  className="text-xl font-medium tracking-tight text-white/70"
                >
                  {year}
                </motion.h2>

                <ul className="flex flex-col divide-y divide-white/[0.07]">
                  {rows.map(({ speaker: s, index }) => (
                    <motion.li
                      key={s.name}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                        delay: LIST_START + index * STEP,
                      }}
                      className="group relative -mx-4 flex flex-col justify-between gap-1 rounded-xl px-4 py-6 transition-colors duration-300 ease-out hover:bg-white/[0.035] md:flex-row md:items-start md:gap-8"
                    >
                      <div className="min-w-0 flex-1 transition-transform duration-300 ease-out group-hover:translate-x-1">
                        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <h3 className="text-base font-medium tracking-tight text-white md:text-lg">
                            {s.name}
                          </h3>
                          <span className="text-sm font-medium text-white/55 transition-colors duration-300 group-hover:text-white/80">
                            {s.role}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-white/40 transition-colors duration-300 group-hover:text-white/60 md:text-sm">
                          {s.background}
                        </p>
                      </div>

                      {s.date && (
                        <div className="shrink-0 whitespace-nowrap text-xs font-medium tabular-nums text-white/45 transition-colors duration-300 group-hover:text-white/70 md:pt-1">
                          {formatDate(s.date)}
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
