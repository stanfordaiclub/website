"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import BackLink from "@/components/back-link";

const NBSP = String.fromCharCode(160); // keeps the word gap width in the title

// Current board — pulled from the live club site (no images). Each row reveals
// a link to the member's LinkedIn on hover.
const MEMBERS: {
  name: string;
  position: string;
  linkedin: string;
  twitter?: string;
}[] = [
  {
    name: "Tanvir Bhathal",
    position: "Co-President",
    linkedin: "https://www.linkedin.com/in/tanvir-bhathal/",
    twitter: "https://x.com/BhathalTanvir0",
  },
  {
    name: "Jason Zhang",
    position: "Co-President",
    linkedin: "https://www.linkedin.com/in/jason-zhang-6860361b8/",
    twitter: "https://x.com/minisounds",
  },
  {
    name: "Sally Zhu",
    position: "President Emeritus",
    linkedin: "https://www.linkedin.com/in/sally-zhu-937b7b127/",
    twitter: "https://x.com/SallyHZhu",
  },
  {
    name: "Asanshay Gupta",
    position: "Design",
    linkedin: "https://www.linkedin.com/in/asanshay/",
    twitter: "https://x.com/AsanshayG",
  },
  {
    name: "Grace Luo",
    position: "Financial Officer",
    linkedin: "https://www.linkedin.com/in/grace-luo-044370175/",
  },
  {
    name: "Ethan Boneh",
    position: "Financial Officer",
    linkedin: "https://www.linkedin.com/in/ethan-boneh/",
    twitter: "https://x.com/ethanboneh",
  },
  {
    name: "Chandra Suda",
    position: "Media",
    linkedin: "https://www.linkedin.com/in/chandrasuda",
    twitter: "https://x.com/chandrasudak",
  },
];

const ROW =
  "grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-3 sm:grid-cols-[1.5fr_1fr] sm:gap-4";

// The "Team" title's letters finish climbing in around here; the table then
// cascades in as the next beat.
const LIST_START = 1.3;
const STEP = 0.07;

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Large heading whose letters each climb up from below their baseline while
 * straightening out of a slight tilt — the same reveal as the landing title.
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
      className="mt-8 whitespace-nowrap text-5xl font-medium leading-[0.95] tracking-tight text-neutral-900 sm:text-8xl"
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden px-[0.06em] align-bottom -mx-[0.06em]"
        >
          <span className="title-letter inline-block will-change-transform">
            {ch === " " ? NBSP : ch}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default function TeamPage() {
  return (
    <main className="min-h-dvh bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-5 sm:px-6 sm:pb-24 sm:pt-20 md:px-10 lg:px-14">
        <BackLink className="text-neutral-900" />

        <AnimatedTitle text="Team" />

        <div className="mt-10 sm:mt-16">
          {/* Column headers */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: LIST_START }}
            className={`${ROW} border-b border-black/10 pb-4 text-sm font-medium text-black/40`}
          >
            <span>Name</span>
            <span className="text-right">Position</span>
          </motion.div>

          {/* group/list: hovering any row dims the *other* names to grey while
              the hovered one stays dark. */}
          <ul className="group/list flex flex-col">
            {MEMBERS.map((m, i) => (
              <motion.li
                key={m.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: LIST_START + (i + 1) * STEP,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`${ROW} group/row border-b border-black/10 py-5`}
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <span className="min-w-0 text-sm font-medium text-neutral-900 transition-colors duration-300 sm:text-base sm:group-hover/list:text-black/30 sm:group-hover/row:!text-neutral-900 md:text-lg">
                    {m.name}
                  </span>
                  {/* Socials — hidden until the row is hovered, then slide in
                      just to the right of the name. */}
                  <div className="flex shrink-0 items-center gap-1 opacity-100 transition-all duration-300 ease-out sm:-translate-x-1 sm:gap-2 sm:opacity-0 sm:group-hover/row:translate-x-0 sm:group-hover/row:opacity-100">
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:text-black sm:h-auto sm:w-auto sm:bg-transparent"
                    >
                      <LinkedInIcon />
                    </a>
                    {m.twitter && (
                      <a
                        href={m.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on X`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:text-black sm:h-auto sm:w-auto sm:bg-transparent"
                      >
                        <XIcon />
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-right text-xs leading-tight text-black/45 transition-colors duration-300 sm:text-sm sm:group-hover/row:!text-neutral-900 md:text-base">
                  {m.position}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
