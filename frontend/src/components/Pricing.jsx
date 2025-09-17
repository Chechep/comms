export default function Pricing() {
    const plans = [
      {
        name: "Starter",
        price: "$99/month",
        description: "Perfect for small organizations getting started",
        features: [
          "Up to 5,000 messages/month",
          "SMS & Email support",
          "Basic templates",
          "Standard support",
          "Basic analytics",
        ],
        cta: "Start Free Trial",
      },
      {
        name: "Professional",
        price: "$299/month",
        description: "Ideal for growing businesses and mid-size organizations",
        features: [
          "Up to 25,000 messages/month",
          "SMS, WhatsApp, Voice & Email",
          "Custom templates",
          "Priority support",
          "Advanced analytics",
          "Two-way messaging",
          "API access",
        ],
        cta: "Start Free Trial",
      },
      {
        name: "Enterprise",
        price: "Custom pricing",
        description: "For large organizations with complex requirements",
        features: [
          "Unlimited messages",
          "All communication channels",
          "Custom integrations",
          "Dedicated support",
          "Advanced security",
          "Custom reporting",
          "SLA guarantee",
          "White-label options",
        ],
        cta: "Contact Sales",
      },
    ];
  
    return (
      <section className="py-20 px-6 bg-[var(--color-bg)] text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
          Choose the plan that fits your organization's communication needs. All
          plans include a 14-day free trial.
        </p>
  
        {/* Plans */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md 
                transition-transform duration-300 hover:scale-105 flex flex-col"
            >
              <h3 className="text-2xl font-semibold mb-2 text-white">{plan.name}</h3>
              <p className="text-xl font-bold mb-2 text-white">{plan.price}</p>
              <p className="text-sm text-white/70 mb-6">{plan.description}</p>
  
              <ul className="text-white/80 mb-6 space-y-2 text-left">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
  
              <a
                href="/signup"
                className="mt-auto inline-block px-5 py-2 rounded-lg border border-gray-500 text-white font-semibold hover:scale-105 hover:shadow-md transition-transform duration-300"
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
  
        {/* Footer note */}
        <p className="text-white/80 mt-12">
          Need a custom solution? We offer tailored pricing for unique requirements.{" "}
          <a href="/contact" className="text-white font-semibold hover:underline">
            Schedule a consultation →
          </a>
        </p>
      </section>
    );
  }
  