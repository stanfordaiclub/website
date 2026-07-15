"use client";

import { useEffect, useState } from "react";
import HeroVideo from "@/components/hero-video";
import SiteTitle from "@/components/site-title";
import Preloader from "@/components/preloader";
import FrameDecor from "@/components/frame-decor";
import NavBar from "@/components/nav-bar";
import IntroText from "@/components/intro-text";
import { useLenis } from "@/components/smooth-scroll";

/**
 * Orchestrates the landing intro: the full-bleed hero video renders immediately
 * (so it downloads while the site loads) and the preloader holds the screen on
 * top of it. Once the preloader clears, the title climbs in.
 */
export default function HomeContent() {
  const [loading, setLoading] = useState(true);
  // Once the preloader has played this session, skip it entirely so returning
  // to the home page doesn't replay the full loading screen.
  const [skipPreloader, setSkipPreloader] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (sessionStorage.getItem("saic-preloaded")) {
      setSkipPreloader(true);
      setLoading(false);
      // No loading screen this time — let the cursor take over normally.
      window.dispatchEvent(new Event("saic:loaded"));
      return;
    }
    // Keep the native cursor while the loading screen is up.
    document.documentElement.classList.add("is-loading");
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("saic-preloaded", "1");
      document.documentElement.classList.remove("is-loading");
      // Loading page is gone — kick off the cursor hand-off countdown.
      window.dispatchEvent(new Event("saic:loaded"));
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Whole-hero click target to the club's YouTube; drives the video
          cursor. Sits below the nav so nav links keep the normal cursor. Only
          active once loading is done, so you can't click through the loader. */}
      {!loading && (
        <a
          href="https://www.youtube.com/@OfficialStanfordAIClub"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch the Stanford AI Club on YouTube"
          data-video-cursor
          className="absolute inset-0 z-[5]"
        />
      )}
      {!skipPreloader && <Preloader show={loading} />}
      <FrameDecor start={!loading} />
      <NavBar start={!loading} />
      <IntroText start={!loading} />
      <SiteTitle start={!loading} />
    </>
  );
}
