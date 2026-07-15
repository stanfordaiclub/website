import HomeContent from "@/components/home-content";
import AboutSection from "@/components/about-section";

export default function Home() {
  return (
    <main className="relative bg-black">
      {/* Hero — one full viewport. The absolutely-positioned intro pieces
          anchor to this section. */}
      <section
        data-snap-section
        className="relative flex h-dvh items-center justify-center overflow-hidden"
      >
        <HomeContent />
      </section>

      {/* Scroll down into the red mission section. */}
      <AboutSection />
    </main>
  );
}
