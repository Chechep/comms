import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 text-center"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-3xl">
        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white"
        >
          Smarter Communication for Every Industry
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-white/90 mb-8">
          Connect your teams, streamline workflows, and keep everyone aligned with
          real-time solutions designed for schools, companies, and hospitals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-brand text-white font-semibold hover:opacity-90 transition"
          >
            Start Free Trial
          </Link>
          <Link
            to="/learn-more"
            className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-brand transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
