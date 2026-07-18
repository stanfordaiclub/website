"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import HeroVideo from "@/components/hero-video";
import SiteTitle from "@/components/site-title";
import Preloader from "@/components/preloader";
import FrameDecor from "@/components/frame-decor";
import NavBar from "@/components/nav-bar";
import IntroText from "@/components/intro-text";
import { useLenis } from "@/components/smooth-scroll";

const PRELOADER_SESSION_KEY = "saic-preloaded";
let homeIntroCompletedInRuntime = false;

/**
 * Orchestrates the landing intro: the full-bleed hero video renders immediately
 * (so it downloads while the site loads) and the preloader holds the screen on
 * top of it. Once the preloader clears, the title climbs in.
 */
export default function HomeContent() {
  const [returningToHome, setReturningToHome] = useState(
    () => homeIntroCompletedInRuntime
  );
  const [loading, setLoading] = useState(() => !homeIntroCompletedInRuntime);
  const [skipPreloader, setSkipPreloader] = useState(
    () => homeIntroCompletedInRuntime
  );
  const lenis = useLenis();

  useLayoutEffect(() => {
    let restoreFrame = 0;
    let hasPlayed = homeIntroCompletedInRuntime;
    try {
      hasPlayed ||= Boolean(sessionStorage.getItem(PRELOADER_SESSION_KEY));
      if (!hasPlayed) sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    } catch {
      hasPlayed = homeIntroCompletedInRuntime;
    }

    if (hasPlayed) {
      document.documentElement.classList.add("saic-preloaded");
      if (!homeIntroCompletedInRuntime) {
        restoreFrame = requestAnimationFrame(() => {
          setReturningToHome(true);
          setSkipPreloader(true);
          setLoading(false);
        });
      }
    }

    homeIntroCompletedInRuntime = true;
    return () => cancelAnimationFrame(restoreFrame);
  }, []);

  useEffect(() => {
    const clearPreloaderFlag = () => {
      try {
        sessionStorage.removeItem(PRELOADER_SESSION_KEY);
      } catch {
        return;
      }
    };
    window.addEventListener("pagehide", clearPreloaderFlag);

    if (returningToHome) {
      return () => window.removeEventListener("pagehide", clearPreloaderFlag);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", clearPreloaderFlag);
    };
  }, [returningToHome]);

  // Freeze the page at the top while the preloader plays, then release it — so
  // there's no way to peek at the red section before the intro has run.
  useEffect(() => {
    if (!lenis) return;
    if (loading) {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, loading]);

  // Seam snap: resting *between* the hero and the red section isn't allowed —
  // once scrolling settles in that gap, glide to whichever edge is closer. But
  // once you're inside the red section, scrolling is free, so all of its rows
  // stay reachable.
  useEffect(() => {
    if (!lenis || loading) return;
    if (window.matchMedia("(max-width: 639px)").matches) return;
    const red = document.querySelectorAll<HTMLElement>("[data-snap-section]")[1];
    if (!red) return;

    let snapping = false;
    let settle: ReturnType<typeof setTimeout>;

    const maybeSnap = () => {
      if (snapping) return;
      const y = window.scrollY;
      const redTop = red.getBoundingClientRect().top + y;
      // Only the gap between hero-top (0) and the red section counts as a seam.
      if (y > 2 && y < redTop - 2) {
        const target = y < redTop / 2 ? 0 : redTop;
        snapping = true;
        lenis.scrollTo(target, {
          duration: 0.9,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            snapping = false;
          },
        });
      }
    };

    const onScroll = () => {
      if (snapping) return;
      clearTimeout(settle);
      settle = setTimeout(maybeSnap, 140);
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      clearTimeout(settle);
    };
  }, [lenis, loading]);

  return (
    <>
      <HeroVideo />
      {/* Whole-hero click target to the club's YouTube. Sits below the nav and
          activates after loading so you can't click through the loader. */}
      {!loading && (
        <a
          href="https://www.youtube.com/@OfficialStanfordAIClub"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch the Stanford AI Club on YouTube"
          className="absolute inset-0 z-[5] hidden sm:block"
        />
      )}
      {!loading && (
        <a
          href="https://www.youtube.com/@OfficialStanfordAIClub"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-[5.25rem] right-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 text-[13px] font-medium text-white/90 backdrop-blur-md sm:hidden"
        >
          Watch on YouTube
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </a>
      )}
      {!skipPreloader && (
        <Preloader
          show={loading}
          onExitComplete={() => document.documentElement.classList.add("saic-preloaded")}
        />
      )}
      <FrameDecor start={!loading} instant={returningToHome} />
      <NavBar start={!loading} instant={returningToHome} />
      <IntroText start={!loading} instant={returningToHome} />
      <SiteTitle start={!loading} instant={returningToHome} />
    </>
  );
}
