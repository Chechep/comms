import { motion } from "framer-motion";
import { UploadCloud, Settings, Send, BarChart2 } from "lucide-react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: "01",
    icon: <UploadCloud className="w-8 h-8 text-[var(--color-brand)]" />,
    title: "Import Your Contacts",
    description:
      "Upload your contact lists or integrate with your existing database for seamless communication.",
    features: ["CSV/Excel import", "Database integration", "Data validation"],
  },
  {
    step: "02",
    icon: <Settings className="w-8 h-8 text-[var(--color-brand)]" />,
    title: "Configure Communication",
    description:
      "Set up automated responses, alert templates and reminders to keep your team and clients informed.",
    features: ["Custom automated responses", "Alert & notification templates", "Scheduled reminders"],
  },
  {
    step: "03",
    icon: <Send className="w-8 h-8 text-[var(--color-brand)]" />,
    title: "Start Communicating",
    description:
      "Send messages instantly via SMS, WhatsApp and email or both at once. Monitor delivery and engagement in real-time.",
    features: ["Multi-channel messaging", "Message preview", "Real-time delivery monitoring"],
  },
  {
    step: "04",
    icon: <BarChart2 className="w-8 h-8 text-[var(--color-brand)]" />,
    title: "Analyze & Optimize",
    description:
      "Collect feedback, view detailed analytics, and improve your communication strategy for better results.",
    features: ["Engagement analytics", "Feedback collection", "Performance insights"],
  },
];

export default function About() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleGetStarted = () => {
    if (auth.currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      className="min-h-screen py-20 px-6 transition-colors"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Get Started in 4 Simple Steps
        </h1>
        <p className="text-lg sm:text-xl opacity-80 leading-relaxed">
          Set up your organization's communication system in minutes, not hours. Our intuitive platform makes it easy to connect with your team, clients, or community.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        {steps.map((step, idx) => (
          <motion.div
            key={step.step}
            className="bg-[var(--color-bg-alt,transparent)] border border-[var(--color-text)]/10 backdrop-blur-md rounded-xl p-6 shadow-md flex flex-col items-start text-left transition hover:shadow-[0_0_20px_#fff]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-bg)] mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
            >
              {step.icon}
            </motion.div>
            <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm opacity-80 mb-3">{step.description}</p>
            <ul className="list-disc pl-5 space-y-1 text-sm opacity-80">
              {step.features.map((feature, fIdx) => (
                <li key={fIdx}>{feature}</li>
              ))}
            </ul>
            <span className="mt-4 text-xs font-medium opacity-50">
              Step {step.step} of 4
            </span>
          </motion.div>
        ))}
      </div>

      {/* ✅ Get Started button */}
      <div className="text-center mt-16">
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 bg-[var(--color-brand)] text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
