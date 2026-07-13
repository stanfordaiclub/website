"use client";

import { useEffect, useState } from "react";
import StarHero from "@/components/star-hero";
import SiteTitle from "@/components/site-title";
import Preloader from "@/components/preloader";

/**
 * Orchestrates the landing intro: the preloader holds the screen, and only once
 * it clears do the star and title begin their animations.
 */
export default function HomeContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={loading} />
      <StarHero start={!loading} />
      <SiteTitle start={!loading} />
    </>
  );
}
