"use client";

import Link from "next/link";

/**
 * Back-to-home link: a thin chevron at 70% opacity that brightens on hover
 * while the "Back to home" label rolls out smoothly from behind it. Colour is
 * inherited from the parent (pass a `text-*` class in `className`).
 */
export default function BackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className={`group -ml-2 inline-flex min-h-11 items-center rounded-full px-2 opacity-70 transition-opacity duration-300 hover:opacity-100 sm:ml-0 sm:min-h-0 sm:px-0 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="h-7 w-7 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1"
      >
        <path d="M15 5 8 12 15 19" />
      </svg>
      {/* grid 0fr → 1fr animates width smoothly, so the label rolls out. */}
      <span className="grid grid-cols-[1fr] opacity-100 transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-cols-[0fr] sm:opacity-0 sm:group-hover:grid-cols-[1fr] sm:group-hover:opacity-100">
        <span className="overflow-hidden">
          <span className="block whitespace-nowrap pl-2 text-sm font-medium tracking-tight">
            Back to home
          </span>
        </span>
      </span>
    </Link>
  );
}
