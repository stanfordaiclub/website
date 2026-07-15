"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useLenis } from "@/components/smooth-scroll";

const HEADING =
  "We bring Stanford’s AI community together to push frontier research forward.";

const ITEMS = [
  {
    n: "01",
    title: "Build Frontier Research",
    body: "Support student-led work across models, learning, safety, optimization, and AI systems.",
  },
  {
    n: "02",
    title: "Develop Research Talent",
    body: "Provide a selective cohort with compute, mentorship, collaborators, and a public research showcase.",
  },
  {
    n: "03",
    title: "Connect Campus to Industry",
    body: "Host leading researchers and builders through talks, events, and small-group gatherings.",
  },
  {
    n: "04",
    title: "Explore AI Beyond Software",
    body: "Advance emerging applications in biology, healthcare, and other complex real-world domains.",
  },
  {
    n: "05",
    title: "Turn Research into Results",
    body: "Our members contribute to published work, frontier labs, and systems deployed across industry.",
  },
  {
    n: "06",
    title: "Partner with the Community",
    body: "Sponsors gain access to Stanford talent, research initiatives, recruiting opportunities, and campus events.",
  },
];

// How much scroll (in vh) each mission gets before the next becomes active.
const SCROLL_PER_ITEM = 26;

/**
 * Section heading revealed letter-by-letter: each letter sits in its own
 * overflow-hidden mask and climbs up from below the baseline while straightening
 * out of a slight tilt — the exact reveal used by the landing title, triggered
 * the moment the heading scrolls into view.
 */
function AnimatedHeading() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(".head-letter", { yPercent: 120, rotate: -14 });
    }, el);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(".head-letter", {
          yPercent: 0,
          rotate: 0,
          transformOrigin: "0% 100%",
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.018,
        });
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  const words = HEADING.split(" ");
  return (
    <h2
      ref={ref}
      aria-label={HEADING}
      className="max-w-4xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* Whole word pinned to one line (whitespace-nowrap) so the
              per-letter inline-blocks can't wrap mid-word ("toget/her") —
              the space between words stays the only break opportunity. */}
          <span aria-hidden className="inline-block whitespace-nowrap align-bottom">
            {word.split("").map((ch, ci) => (
              <span
                key={ci}
                className="inline-block overflow-hidden px-[0.03em] pb-[0.12em] align-bottom -mx-[0.03em]"
              >
                <span className="head-letter inline-block will-change-transform">
                  {ch}
                </span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h2>
  );
}

/** A vertical guide that continues the hero frame, drawing downward as the section scrolls in. */
function VLine({ side }: { side: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute top-0 h-full w-px origin-top bg-white/15 ${side}`}
    />
  );
}

/** A hairline divider that draws itself in from the left when scrolled into view. */
function Line({ index }: { index: number }) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      className="h-px w-full origin-left bg-white/25"
    />
  );
}

/**
 * Red mission section below the hero. The panel is pinned while a tall track
 * scrolls behind it: scroll progress picks the active mission, and only that
 * mission's description is revealed — expanding with a smooth height + fade as
 * you scroll to it, so the descriptions show one after another.
 */
export default function AboutSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      // Progress through the tall track: 0 at its top, 1 once fully scrolled.
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = -track.getBoundingClientRect().top;
      const p = total > 0 ? scrolled / total : 0;
      const idx = Math.max(
        0,
        Math.min(ITEMS.length - 1, Math.floor(p * ITEMS.length))
      );
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Lenis smooths the scroll and may not emit native scroll events every
    // frame, so subscribe to it directly; keep window as a fallback.
    if (lenis) lenis.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      if (lenis) lenis.off("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [lenis]);

  return (
    <section data-snap-section className="relative bg-[#E11D2A] text-white">
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${100 + ITEMS.length * SCROLL_PER_ITEM}vh` }}
      >
        {/* Pinned panel — stays put while the track scrolls past. */}
        <div className="sticky top-0 flex h-dvh flex-col overflow-hidden [justify-content:safe_center]">
          {/* Vertical guides continuing the hero frame down into this section. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <VLine side="left-[1.25rem]" />
            <VLine side="right-[1.25rem]" />
            <VLine side="left-[4rem]" />
            <VLine side="right-[4rem]" />
          </div>

          <div className="relative z-10 w-full max-w-5xl px-6 py-[6vh] sm:px-10 lg:px-16">
            <AnimatedHeading />

            <ul className="mt-[5vh]">
              {ITEMS.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.n}>
                    <Line index={i} />
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                        delay: i * 0.08,
                      }}
                      className="flex gap-6 py-5 sm:gap-10"
                    >
                      <span
                        className={`w-6 shrink-0 pt-2 text-xs font-medium tabular-nums transition-colors duration-500 ${
                          isActive ? "text-white" : "text-white/40"
                        }`}
                      >
                        {item.n}
                      </span>

                      <div className="flex-1">
                        <h3
                          style={{ fontFamily: "var(--font-ciburial)" }}
                          className={`text-xl font-normal tracking-tight transition-colors duration-500 sm:text-2xl ${
                            isActive ? "text-white" : "text-white/65"
                          }`}
                        >
                          {item.title}
                        </h3>

                        {/* Only the active mission's description is shown; it
                            reveals with a smooth height + fade as you scroll. */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isActive ? "auto" : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pt-3 text-base leading-relaxed text-white/85 sm:text-lg">
                            {item.body}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </li>
                );
              })}
              <Line index={ITEMS.length} />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
