"use client";

import { useEffect, useState } from "react";
import HeroVideo from "@/components/hero-video";
import SiteTitle from "@/components/site-title";
import Preloader from "@/components/preloader";

/**
 * Orchestrates the landing intro: the full-bleed hero video renders immediately
 * (so it downloads while the site loads) and the preloader holds the screen on
 * top of it. Once the preloader clears, the title climbs in.
 */
export default function HomeContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroVideo />
      <Preloader show={loading} />
      <SiteTitle start={!loading} />
    </>
  );
}
