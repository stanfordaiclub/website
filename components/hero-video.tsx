"use client";

/**
 * Full-bleed background video for the landing hero. It fills the whole viewport
 * behind the title. The element is rendered in the initial HTML with
 * `preload="auto"` and a poster frame, so the browser starts fetching the video
 * (and paints the first frame) while the rest of the site is still loading.
 */
export default function HeroVideo() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden bg-black">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/header-poster.jpg"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
      >
        {/* WebM (VP9) first — ~40% smaller for modern browsers; MP4 fallback
            keeps it playing on older Safari/iOS. */}
        <source src="/header.webm" type="video/webm" />
        <source src="/header.mp4" type="video/mp4" />
      </video>
      {/* Subtle scrim so the white title stays legible over bright frames. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-black/50 via-black/20 to-transparent" />
    </div>
  );
}
