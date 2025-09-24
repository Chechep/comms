import Hero from "../components/Hero";
import Services from "../components/Services";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Solutions from "./Solutions";
export default function Home() {
  return (
    <main className="w-full transition-colors duration-500 bg-[var(--color-bg)] text-[var(--color-text)]">
      <Hero />
      <Solutions />
      <Services />
      <Features />
      <Pricing />
    </main>
  );
}

