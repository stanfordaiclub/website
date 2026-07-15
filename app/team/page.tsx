"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";

const NBSP = String.fromCharCode(160); // keeps the word gap width in the title

// Current board — pulled from the live club site (no images). Each row reveals
// a link to the member's LinkedIn on hover.
const MEMBERS = [
  {
    name: "Tanvir Bhathal",
    position: "Co-President",
    linkedin: "https://www.linkedin.com/in/tanvir-bhathal/",
  },
  {
    name: "Jason Zhang",
    position: "Co-President",
    linkedin: "https://www.linkedin.com/in/jason-zhang-6860361b8/",
  },
  {
    name: "Sally Zhu",
    position: "President Emeritus",
    linkedin: "https://www.linkedin.com/in/sally-zhu-937b7b127/",
  },
  {
    name: "Asanshay Gupta",
    position: "Design",
    linkedin: "https://www.linkedin.com/in/asanshay/",
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
  },
  {
    name: "Chandra Suda",
    position: "Media",
    linkedin: "https://www.linkedin.com/in/chandrasuda",
  },
];

const ROW = "grid grid-cols-[1.5fr_1fr_2.5rem] items-center gap-4";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/**
 * Back-to-home link: a crisp chevron that, on hover, slides the label
 * "Back to home" cleanly out from behind it.
 */
function BackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className={`group inline-flex items-center text-white ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="h-7 w-7 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1"
      >
        <path d="M15 5 8 12 15 19" />
      </svg>
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:max-w-[10rem] group-hover:opacity-100">
        <span className="pl-2 text-sm font-medium tracking-tight">
          Back to home
        </span>
      </span>
    </Link>
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
      className="mt-8 whitespace-nowrap text-6xl font-medium leading-[0.95] tracking-tight text-white sm:text-8xl"
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
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-16 sm:pt-20 md:px-10 lg:px-14">
        <BackLink />

        <AnimatedTitle text="Team" />

        <div className="mt-16">
          {/* Column headers */}
          <div
            className={`${ROW} border-b border-white/15 pb-4 text-sm font-medium text-white/45`}
          >
            <span>Name</span>
            <span className="text-right">Position</span>
            <span />
          </div>

          <ul className="flex flex-col">
            {MEMBERS.map((m, i) => (
              <motion.li
                key={m.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i * 0.05, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`${ROW} group border-b border-white/10 py-5`}
              >
                <span className="text-base text-white/70 transition-colors duration-300 group-hover:text-white md:text-lg">
                  {m.name}
                </span>
                <span className="text-right text-sm text-white/45 transition-colors duration-300 group-hover:text-white md:text-base">
                  {m.position}
                </span>
                {/* LinkedIn — hidden until the row is hovered, then slides in. */}
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  className="flex translate-x-2 justify-end text-white/70 opacity-0 transition-all duration-300 ease-out hover:text-white group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <LinkedInIcon />
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
