// src/pages/Home.jsx
import Hero from "../components/Hero";
import Services from "../components/Services";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Solutions from "./Solutions";

export default function Home() {
  return (
    <main
      className="
        min-h-screen w-full transition-colors duration-500
        bg-[var(--color-bg)] text-[var(--color-text)]
      "
    >
      {/* Hero Section */}
      <section className="w-full">
        <Hero />
      </section>

      {/* Solutions Section */}
      <section className="w-full">
        <Solutions />
      </section>

      {/* Services Section */}
      <section className="w-full">
        <Services />
      </section>

      {/* Features Section */}
      <section className="w-full">
        <Features />
      </section>

      {/* Pricing Section */}
      <section className="w-full">
        <Pricing />
      </section>
    </main>
  );
}
