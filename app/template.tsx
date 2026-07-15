"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Module scope survives client-side navigations, so it's false only on the very
// first mount (the initial page load) and true for every navigation after.
let hasNavigated = false;

/**
 * Templates remount on every navigation. On each navigation (but not the first
 * load, which the home preloader owns) we replay the preloader's "stairs" wipe —
 * faster — so pages transition with the same staggered stair reveal.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [play] = useState(() => {
    const wasNavigation = hasNavigated;
    hasNavigated = true;
    return wasNavigation;
  });
  const [done, setDone] = useState(!play);

  return (
    <>
      {children}
      {!done && <StairsTransition onDone={() => setDone(true)} />}
    </>
  );
}

/** Black stair columns that cover the screen on mount, then wipe away quickly. */
function StairsTransition({ onDone }: { onDone: () => void }) {
  const cols = [...Array(10)];
  const tween = (i: number) => ({
    duration: 0.55,
    delay: 0.05 * i,
    ease: [0.7, 0, 0.3, 1] as const,
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-[110]">
      <div className="fixed left-0 top-0 flex h-[50vh] w-full">
        {cols.map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: "100%" }}
            animate={{ height: 0 }}
            transition={tween(i)}
            onAnimationComplete={i === cols.length - 1 ? onDone : undefined}
            className="h-full w-[10vw] bg-black"
          />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex h-[50vh] w-full items-end">
        {cols.map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: "100%" }}
            animate={{ height: 0 }}
            transition={tween(i)}
            className="h-full w-[10vw] bg-black"
          />
        ))}
      </div>
    </div>
  );
}
