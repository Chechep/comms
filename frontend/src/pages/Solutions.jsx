// Solutions.jsx
import { Cloud, Cpu, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Solutions() {
  const solutions = [
    {
      icon: <Cloud className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Cloud Integration",
      description: "Seamlessly connect apps and services through secure cloud solutions.",
    },
    {
      icon: <Cpu className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "AI & Automation",
      description: "Boost efficiency with intelligent workflows and automation tools.",
    },
    {
      icon: <Shield className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Cybersecurity",
      description: "Protect your data with top-level security and monitoring solutions.",
    },
    {
      icon: <Users className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Collaboration Tools",
      description: "Empower teams with real-time collaboration and communication features.",
    },
  ];

  return (
    <section
      className="
        min-h-screen flex items-center justify-center px-6 py-20 transition-colors
      "
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-6xl w-full text-center">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-glow">
          Our Solutions
        </h1>
        <p className="text-lg opacity-90 mb-14 max-w-2xl mx-auto">
          Explore the wide range of solutions we offer to help your business
          thrive in the digital era.
        </p>

        {/* Grid of solutions */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, idx) => (
            <motion.div
              key={idx}
              className="
                p-6 rounded-xl border border-[var(--color-text)]/10 
                bg-[var(--color-bg-alt,transparent)] backdrop-blur-md text-center
                transition-transform duration-300
              "
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 20px var(--color-brand)`,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              {solution.icon}
              <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
              <p className="opacity-80">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
