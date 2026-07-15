"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-screen loading overlay adapted from Skiper UI's skiper10 (Preloader_004).
 * Shows welcome text over a "stairs" wipe, then reveals the landing page beneath.
 * Controlled via `show` so the parent can coordinate when the page animations begin.
 */
export default function Preloader({ show }: { show: boolean }) {
  return (
    <AnimatePresence mode="wait">{show && <Stairs />}</AnimatePresence>
  );
}

const Stairs = () => {
  const words = "Stanford's home for students in AI".split(" ");

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Welcome text */}
      <div className="absolute z-10 flex h-full w-full items-center justify-center text-center text-white">
        <motion.h1
          className="text-3xl font-medium tracking-tighter"
          style={{ fontFamily: "var(--font-bdo-grotesk)" }}
        >
          {words.map((word, index) => (
            <span key={index} className="mr-2 inline-block overflow-hidden pb-1">
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                // Roll up and out (never back down) so the text leaves with the
                // stairs wipe instead of dropping.
                exit={{
                  y: "-115%",
                  transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] },
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </div>

      {/* Stairs wipe — top half */}
      <div className="pointer-events-none fixed left-0 top-0 z-[2] flex h-[50vh] w-full">
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ height: "100%" }}
            animate={{ height: "100%" }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + 0.05 * index,
              ease: [0.455, 0.03, 0.515, 0.955],
            }}
            className="h-full w-[10vw] bg-black"
          />
        ))}
      </div>

      {/* Stairs wipe — bottom half */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-[2] flex h-[50vh] w-full items-end">
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ height: "100%" }}
            animate={{ height: "100%" }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + 0.05 * index,
              ease: [0.455, 0.03, 0.515, 0.955],
            }}
            className="h-full w-[10vw] bg-black"
          />
        ))}
      </div>
    </motion.div>
  );
};
