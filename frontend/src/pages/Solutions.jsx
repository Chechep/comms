// src/pages/Solutions.jsx
import { motion } from "framer-motion";
import { Clock, Users, CheckCircle } from "lucide-react";

export default function Solutions() {
  const stats = [
    {
      icon: <Clock className="w-10 h-10 mx-auto mb-4 text-[var(--color-brand)]" />,
      value: "< 2 sec",
      label: "Message Delivery",
      description: "Lightning-fast message delivery worldwide",
    },
    {
      icon: <Users className="w-10 h-10 mx-auto mb-4 text-[var(--color-brand)]" />,
      value: "10k+",
      label: "Recipients",
      description: "Broadcast to unlimited parents and students",
    },
    {
      icon: <CheckCircle className="w-10 h-10 mx-auto mb-4 text-[var(--color-brand)]" />,
      value: "99.5%",
      label: "Open Rate",
      description: "Higher engagement than email communication",
    },
  ];

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center transition-colors bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <div className="max-w-6xl w-full text-center px-4">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-[var(--color-brand)] mb-2">
          Trusted Worldwide
        </h2>
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-glow mb-12">
          Delivering reliable communication solutions
        </h1>

        {/* Stats Section */}
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="rounded-xl border border-[var(--color-text)]/10 bg-[var(--color-bg-alt,transparent)] backdrop-blur-md shadow-md p-6 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              {stat.icon}
              <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-brand)]">
                {stat.value}
              </h3>
              <p className="text-lg font-medium">{stat.label}</p>
              <p className="text-sm opacity-80 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
