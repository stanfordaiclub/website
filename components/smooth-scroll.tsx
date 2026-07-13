"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

/**
 * Site-wide smooth scrolling. Lenis interpolates the native scroll and is
 * driven off GSAP's ticker so its motion stays in sync with GSAP animations.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // Recommended when driving Lenis from the GSAP ticker.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
