import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Phone, Mail, Smartphone, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const words = ["Industries", "Schools", "Hospitals", "Companies", "Organizations"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative py-24 bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-[var(--color-text)]">
            Unified Communication <br />
            Across{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-[var(--color-brand)]"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="text-lg sm:text-xl mb-8 opacity-80 max-w-xl text-[var(--color-text)]">
            Power your business with SMS, WhatsApp, voice calls and email —
            all in one platform serving schools, hospitals, companies and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              to="/Login"
              className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:scale-105 transition"
              style={{ background: "var(--color-brand)" }}
            >
              Start Free Trial
            </Link>
            <Link
              to="/About"
              className="px-6 py-3 rounded-lg border font-semibold flex items-center justify-center gap-2 hover:scale-105 transition"
              style={{
                borderColor: "var(--color-text)",
                color: "var(--color-text)",
              }}
            >
              <Play size={18} /> Get Started
            </Link>
          </div>

          {/* Icons row */}
          <div className="flex gap-8 flex-wrap">
            {[
              { icon: Smartphone, label: "SMS" },
              { icon: MessageSquare, label: "WhatsApp" },
              { icon: Phone, label: "Voice Calls" },
              { icon: Mail, label: "Email" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center hover:scale-110 transition"
              >
                <Icon size={28} className="text-[var(--color-brand)]" />
                <span className="text-sm mt-2 text-[var(--color-text)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (Illustration) */}
        <div className="flex justify-center">
          <img
            src="/frontend/src/assets/hero-illustration.jpg"
            alt="Communication Illustration"
            className="w-full max-w-md drop-shadow-lg"
          />
        </div>
        
      </div>
    </section>
  );
}
