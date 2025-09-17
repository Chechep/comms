export default function Features() {
    const features = [
      {
        title: "Real-time Messaging",
        description: "Stay connected with instant messaging across all your teams.",
      },
      {
        title: "Custom Workflows",
        description: "Automate processes and streamline daily tasks effortlessly.",
      },
      {
        title: "Analytics & Reports",
        description: "Get insights into team performance and project progress.",
      },
      {
        title: "Secure Cloud Storage",
        description: "Keep all your files safe and accessible anywhere, anytime.",
      },
    ];
  
    return (
      <section className="py-20 px-4 text-center bg-[var(--color-bg)]">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-white">
          Features
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-white/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  