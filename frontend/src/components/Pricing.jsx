export default function Pricing() {
    const plans = [
      {
        name: "Starter",
        price: "$19/mo",
        features: ["Basic messaging", "1 project", "Email support"],
      },
      {
        name: "Pro",
        price: "$49/mo",
        features: ["Unlimited messaging", "5 projects", "Priority support"],
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: ["All features", "Unlimited projects", "Dedicated support"],
      },
    ];
  
    return (
      <section className="py-20 px-4 text-center bg-[var(--color-bg)]">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-white">
          Pricing
        </h2>
  
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col justify-between hover:scale-105 transition"
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">
                {plan.name}
              </h3>
              <p className="text-white/90 mb-6">{plan.price}</p>
              <ul className="text-white/90 mb-6 space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <a
                href="/signup"
                className="mt-auto px-4 py-2 rounded-lg bg-brand text-white font-semibold hover:opacity-90 transition"
              >
                Choose Plan
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  