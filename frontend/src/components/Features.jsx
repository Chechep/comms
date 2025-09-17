import { MessageSquare, Workflow, BarChart3, Cloud } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: <MessageSquare className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Real-time Messaging",
      description: "Stay connected with instant messaging across all your teams.",
    },
    {
      icon: <Workflow className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Custom Workflows",
      description: "Automate processes and streamline daily tasks effortlessly.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Analytics & Reports",
      description: "Get insights into team performance and project progress.",
    },
    {
      icon: <Cloud className="w-10 h-10 mb-4 mx-auto text-[var(--color-brand)]" />,
      title: "Secure Cloud Storage",
      description: "Keep all your files safe and accessible anywhere, anytime.",
    },
  ];

  return (
    <section
      className="py-20 px-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Features</h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Everything you need for seamless communication and smarter collaboration.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="p-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-center transition-transform duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 20px var(--color-brand)`,
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="opacity-80">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
