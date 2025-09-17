import { MessageSquare, Workflow, BarChart3, Cloud } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <MessageSquare className="w-10 h-10 text-brand mb-4 mx-auto" />,
      title: "Real-time Messaging",
      description: "Stay connected with instant messaging across all your teams.",
    },
    {
      icon: <Workflow className="w-10 h-10 text-brand mb-4 mx-auto" />,
      title: "Custom Workflows",
      description: "Automate processes and streamline daily tasks effortlessly.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-brand mb-4 mx-auto" />,
      title: "Analytics & Reports",
      description: "Get insights into team performance and project progress.",
    },
    {
      icon: <Cloud className="w-10 h-10 text-brand mb-4 mx-auto" />,
      title: "Secure Cloud Storage",
      description: "Keep all your files safe and accessible anywhere, anytime.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[var(--color-bg)]">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
        Features
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md hover:scale-105 hover:shadow-lg transition-transform duration-300 text-center"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
