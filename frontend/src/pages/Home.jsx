import Hero from "../components/Hero";
import Services from "../components/Services";
import Features from "../components/Features";
import Pricing from "../components/Pricing";

export default function Home() {
  return (
    <main
      className="
        min-h-screen w-full transition-colors duration-500
        bg-[var(--color-bg)] text-[var(--color-text)]
      "
    >
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Hero />
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 bg-[var(--color-bg-alt,transparent)]">
        <div className="max-w-7xl mx-auto px-4">
          <Services />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Features />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 bg-[var(--color-bg-alt,transparent)]">
        <div className="max-w-7xl mx-auto px-4">
          <Pricing />
        </div>
      </section>
    </main>
  );
}
