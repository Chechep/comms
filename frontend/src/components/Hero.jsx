import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Phone, Mail, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero({ darkMode, themeColor }) {
  const words = ["Industries", "Companies", "Organizations", "Schools", "Hospitals"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 text-center"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-3xl">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white dark:text-white">
          Unified Communication <br />
          Across{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={words[index]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{
                color: darkMode ? themeColor : "#6b7280", // gray-500 in light mode, theme color in dark mode
              }}
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-white/90 mb-8">
          Power your business with SMS, WhatsApp, voice calls, and email — all in
          one platform serving schools, hospitals, companies, and more.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:scale-110 hover:animate-shake transition"
          >
            Start Free Trial
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:scale-110 hover:animate-shake transition"
          >
            Learn More
          </Link>
        </div>

        {/* Icons row */}
        <div className="flex justify-center gap-8 text-white/80">
          <div className="flex flex-col items-center">
            <Smartphone size={28} />
            <span className="text-sm mt-2">SMS</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageSquare size={28} />
            <span className="text-sm mt-2">WhatsApp</span>
          </div>
          <div className="flex flex-col items-center">
            <Phone size={28} />
            <span className="text-sm mt-2">Voice Calls</span>
          </div>
          <div className="flex flex-col items-center">
            <Mail size={28} />
            <span className="text-sm mt-2">Email</span>
          </div>
        </div>
      </div>
    </section>
  );
}
