"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Access the shared Lenis instance (null until it has mounted). */
export const useLenis = () => useContext(LenisContext);

/**
 * Site-wide smooth scrolling. Lenis interpolates the native scroll and is
 * driven off GSAP's ticker so its motion stays in sync with GSAP animations.
 * The instance is shared through context so pages can drive it (snap, stop).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    });

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    // Recommended when driving Lenis from the GSAP ticker.
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
