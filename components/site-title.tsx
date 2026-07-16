import DiffusionText from "@/components/diffusion-text";

const TITLE = "Stanford AI Club";

export default function SiteTitle({ start = true }: { start?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-20 w-full px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:left-auto sm:right-0 sm:w-auto sm:px-0 sm:pr-[5.5rem] sm:pb-[4.5rem]"
      style={{ fontFamily: "var(--font-ciburial)" }}
    >
      <h1
        aria-label={TITLE}
        className="whitespace-nowrap text-[clamp(2.35rem,11.5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.05em] text-white sm:text-[clamp(2rem,8.5vw,10rem)]"
      >
        <DiffusionText
          text={TITLE}
          start={start}
          delay={180}
          duration={1450}
          stepMs={45}
          salt={1}
          characterClassName="px-[0.06em] -mx-[0.06em] align-bottom"
        />
      </h1>
    </div>
  );
}
