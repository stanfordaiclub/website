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
  const lenis = useLenis();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
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
      <Preloader show={loading} />
      <FrameDecor start={!loading} />
      <NavBar start={!loading} />
      <IntroText start={!loading} />
      <SiteTitle start={!loading} />
    </>
  );
}
