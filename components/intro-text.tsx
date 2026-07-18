import DiffusionText from "@/components/diffusion-text";

const COPY =
  "Stanford’s student-run community for frontier AI research. Organization of, for, and by undergraduate students and graduate students across SAIL, leading labs, and industry.";

/**
 * Short mission blurb in the top-left corner. Its token field denoises after
 * the hero title begins resolving.
 */
export default function IntroText({
  start = true,
  instant = false,
}: {
  start?: boolean;
  instant?: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute left-6 right-16 top-24 z-20 max-w-none sm:bottom-0 sm:left-[5rem] sm:right-auto sm:top-auto sm:max-w-[28rem] sm:pb-[4.5rem]"
    >
      <p
        aria-label={COPY}
        className="text-[13px] font-medium leading-[1.55] tracking-[-0.02em] text-white/75 sm:text-base sm:leading-relaxed sm:text-white/70"
      >
        <DiffusionText
          text={COPY}
          start={start}
          instant={instant}
          delay={450}
          duration={1800}
          stepMs={50}
          salt={4}
        />
      </p>
    </div>
  );
}
