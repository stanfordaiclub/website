import DiffusionText from "@/components/diffusion-text";

const COPY =
  "Stanford AI Club is where the students that shape the future of AI at Stanford come together. From research to industry, we offer opportunities to connect with titans of industry, learn from the best in the field, and get started in the field.";

/**
 * Short mission blurb in the top-left corner. Its token field denoises after
 * the hero title begins resolving.
 */
export default function IntroText({ start = true }: { start?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute left-6 top-24 z-20 max-w-[17rem] sm:left-[5rem] sm:top-auto sm:bottom-0 sm:max-w-[28rem] sm:pb-[4.5rem]"
    >
      <p
        aria-label={COPY}
        className="text-sm font-medium leading-relaxed tracking-[-0.02em] text-white/70 sm:text-base"
      >
        <DiffusionText
          text={COPY}
          start={start}
          delay={450}
          duration={1800}
          stepMs={50}
          salt={4}
        />
      </p>
    </div>
  );
}
