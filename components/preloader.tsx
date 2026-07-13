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
          className="text-3xl font-semibold tracking-tighter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 4 } }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 0.2 * index }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
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
