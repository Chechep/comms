import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";

export default function Home() {
  return (
    <main
      className="min-h-screen w-full text-[var(--color-text)] transition-colors duration-500"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Hero Section */}
      <section className="relative">
        <Hero />
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24">
        <Features />
      </section>

      {/* Pricing Section */}
      <section className="relative py-16 md:py-24">
        <Pricing />
      </section>
    </main>
  );
}
