"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { label: "Speakers", href: "/speakers" },
  { label: "Team", href: "/team" },
  { label: "Get Involved", href: "/get-involved" },
];

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/stanfordaiclub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@OfficialStanfordAIClub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const ROLL =
  "transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)]";

const NBSP = String.fromCharCode(160); // keeps word gaps through the per-letter mask

/**
 * A label whose letters each roll up and out on hover while a fresh copy rolls
 * in from below, staggered left-to-right for a cascading feel.
 */
function RollingText({ text }: { text: string }) {
  return (
    <span className="relative inline-flex">
      {text.split("").map((ch, i) => {
        const c = ch === " " ? NBSP : ch;
        const style = { transitionDelay: `${i * 25}ms` };
        return (
          <span key={i} className="relative inline-block overflow-hidden">
            <span className={`inline-block ${ROLL} group-hover:-translate-y-full`} style={style}>
              {c}
            </span>
            <span
              aria-hidden
              className={`absolute inset-0 inline-block translate-y-full ${ROLL} group-hover:translate-y-0`}
              style={style}
            >
              {c}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * Minimal top-right navigation over the hero. On desktop, muted labels that
 * brighten to white with a per-letter roll and an underline sweep on hover,
 * followed by the club's social links. On mobile it collapses to a hamburger
 * menu with the pages and socials.
 */
export default function NavBar({ start = true }: { start?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Keep the controls quiet behind the preloader.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.set(".nav-item", {
        autoAlpha: 0,
        y: 8,
        filter: "blur(4px)",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!start) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        {
          autoAlpha: 0,
          y: 8,
          filter: "blur(4px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.055,
          delay: 0.95,
        }
      );
    }, root);

    return () => ctx.revert();
  }, [start]);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav
        ref={rootRef}
        className="fixed right-2 top-2 z-40 flex h-12 items-center pr-2 sm:right-0 sm:top-[1.25rem] sm:h-[2.75rem] sm:pr-[5.5rem]"
      >
        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 sm:flex sm:gap-10">
          {LINKS.map(({ label, href }) => (
            <li key={href} className="flex items-center">
              <Link
                href={href}
                aria-label={label}
                className="nav-item group relative inline-block text-sm font-medium tracking-[-0.02em] text-white/60 transition-colors will-change-[transform,filter,opacity] hover:text-white"
              >
                <RollingText text={label} />
                {/* Underline sweep — preserved alongside the letter roll */}
                <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </li>
          ))}

          <li className="flex py-1.5">
            <div className="flex items-center gap-3.5">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="nav-item inline-flex text-white/60 transition-colors will-change-[transform,filter,opacity] hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </li>
        </ul>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="nav-item relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px] text-white will-change-[transform,filter,opacity] sm:hidden"
        >
          <motion.span
            className="block h-px w-6 bg-white"
            animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.span
            className="block h-px w-6 bg-white"
            animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-30 flex flex-col justify-end bg-black/90 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24 backdrop-blur-md sm:hidden"
          >
            <motion.ul
              className="flex flex-col gap-5"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
            >
              {LINKS.map(({ label, href }) => (
                <motion.li
                  key={href}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block py-1 text-[clamp(2.75rem,13vw,4rem)] font-medium leading-none tracking-tight text-white/90 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}

              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 flex items-center gap-3"
              >
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {icon}
                  </a>
                ))}
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
