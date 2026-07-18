"use client";

import { AnimatePresence, motion } from "framer-motion";

/**
 * Full-screen loading overlay adapted from Skiper UI's skiper10 (Preloader_004).
 * Shows welcome text over a "stairs" wipe, then reveals the landing page beneath.
 * Controlled via `show` so the parent can coordinate when the page animations begin.
 */
export default function Preloader({
  show,
  onExitComplete,
}: {
  show: boolean;
  onExitComplete?: () => void;
}) {
  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {show && <Stairs />}
    </AnimatePresence>
  );
}

const Stairs = () => {
  const copy = "Stanford's home for students in AI";
  const words = copy.split(" ");

  return (
    <motion.div className="saic-session-preloader pointer-events-none fixed inset-0 z-[100]">
      {/* Welcome text */}
      <div className="absolute z-10 flex h-full w-full items-center justify-center text-center text-white">
        <motion.h1
          aria-label={copy}
          className="px-8 text-2xl font-medium leading-tight tracking-tighter sm:px-0 sm:text-3xl"
          style={{ fontFamily: "var(--font-bdo-grotesk)" }}
          exit={{
            y: -20,
            opacity: 0,
            filter: "blur(5px)",
            transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] },
          }}
        >
          {words.map((word, index) => (
            <span key={word} className="mr-2 inline-block overflow-hidden pb-1">
              <motion.span
                className="inline-block"
                initial={{ y: "-115%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.055 * index,
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
