"use client";

import { motion } from "framer-motion";

/**
 * Static thin-line frame matching the landing hero's FrameDecor: an inset outer
 * rectangle plus inner margin lines at 4rem that cross to carve corner boxes.
 * Fades in softly. Purely decorative; sits behind page content.
 */
export default function PageFrame({ tone = "light" }: { tone?: "light" | "dark" }) {
  const line =
    tone === "dark"
      ? "absolute bg-black/10"
      : "absolute bg-white/10";

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className="pointer-events-none absolute inset-0 z-0"
    >
      {/* Outer inset rectangle */}
      <div className="absolute inset-3 sm:inset-[1.25rem]">
        <div className={`${line} left-0 top-0 h-px w-full`} />
        <div className={`${line} bottom-0 left-0 h-px w-full`} />
        <div className={`${line} left-0 top-0 h-full w-px`} />
        <div className={`${line} right-0 top-0 h-full w-px`} />
      </div>

      {/* Inner margin lines — full-bleed, crossing the frame to cut corner boxes */}
      <div className={`${line} left-0 top-[4rem] hidden h-px w-full sm:block`} />
      <div className={`${line} bottom-[4rem] left-0 hidden h-px w-full sm:block`} />
      <div className={`${line} left-[4rem] top-0 hidden h-full w-px sm:block`} />
      <div className={`${line} right-[4rem] top-0 hidden h-full w-px sm:block`} />
    </motion.div>
  );
}
