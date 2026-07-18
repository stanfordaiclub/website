"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import BackLink from "@/components/back-link";
import PageFrame from "@/components/page-frame";
import OriginalRails from "@/components/original-rails";

const INTRO =
  "Are you a Stanford student? Join us to learn more about talks, research opportunities, and initiatives in AI!";

const MAILING_LIST =
  "https://mailman.stanford.edu/mailman/listinfo/saic-members";

const SOCIALS = [
  {
    label: "X",
    href: "https://twitter.com/stanfordaiclub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@StanfordAIClub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

/**
 * Large heading revealed letter-by-letter — each letter climbs from below the
 * baseline while straightening out of a tilt (the landing-title reveal). Words
 * stay intact but the whole title can wrap between words on small screens.
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
          stagger: 0.05,
          delay: 0.2,
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const words = text.split(" ");
  return (
    <h1
      ref={rootRef}
      aria-label={text}
      className="text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl"
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span aria-hidden className="inline-block whitespace-nowrap align-bottom">
            {word.split("").map((ch, ci) => (
              <span
                key={ci}
                className="inline-block overflow-hidden px-[0.06em] align-bottom -mx-[0.06em]"
              >
                <span className="title-letter inline-block will-change-transform">
                  {ch}
                </span>
              </span>
            ))}
          </span>
          {/* Real, breakable space between words (outside the nowrap span). */}
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}

export default function GetInvolvedPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-black text-white sm:overflow-hidden">
      {/* Ambient animated red bars, faded out over the left so the copy stays
          clean; a warm glow anchors the corner. */}
      <div className="absolute inset-0 z-0">
        <OriginalRails
          backgroundColor="#000000"
          lineColor="#241010"
          barColor="#b81d24"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to right, #000 0%, #000 46%, rgba(0,0,0,0) 86%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #000 0%, #000 10%, rgba(0,0,0,0) 42%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 z-0 h-[34rem] w-[34rem] rounded-full bg-[#ac1515]/20 blur-[130px]"
      />

      <PageFrame />
      <BackLink className="fixed left-3 top-3 z-30 text-white sm:left-6 sm:top-6" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 sm:px-10 sm:pb-16 sm:pt-14 lg:px-[5.5rem]">
        <div aria-hidden className="h-11 shrink-0 sm:h-7" />

        <div className="flex flex-1 flex-col justify-center py-12 sm:py-16">
          <p className="mb-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-white/40">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ac1515]" />
            Stanford AI Club
          </p>

          <AnimatedTitle text="Get Involved" />

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:mt-9 sm:text-lg md:text-xl">
            {INTRO}
          </p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:mt-12 sm:flex-row sm:items-center">
            <a
              href={MAILING_LIST}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-gradient-to-b from-[#ac1515]/70 to-[#ac1515]/20 px-8 py-3.5 text-lg font-medium tracking-tight text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-[#ac1515]/85 hover:shadow-2xl active:scale-95 sm:w-auto"
            >
              Join Mailing List
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>

            <div className="flex gap-3.5">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3.5 text-white/80 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white hover:shadow-2xl active:scale-95"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
