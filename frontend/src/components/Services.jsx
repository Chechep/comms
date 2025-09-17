import {
  GraduationCap,
  Stethoscope,
  Briefcase,
  ShoppingCart,
  Sparkles,
  Circle,
} from "lucide-react";

export default function Services({ darkMode, themeColor }) {
  // Dynamic accent color: themeColor in dark mode, gray in light mode
  const dynamicColor = darkMode ? themeColor : "#6b7280";

  const services = [
    {
      icon: <GraduationCap size={32} style={{ color: dynamicColor }} />,
      title: "Education",
      subtitle: "Schools & Universities",
      points: [
        "Attendance alerts to parents",
        "Exam schedule notifications",
        "Parent-teacher meeting reminders",
        "Emergency broadcasts",
      ],
    },
    {
      icon: <Stethoscope size={32} style={{ color: dynamicColor }} />,
      title: "Healthcare",
      subtitle: "Hospitals & Clinics",
      points: [
        "Appointment reminders",
        "Lab result notifications",
        "Prescription refill alerts",
        "Emergency communications",
      ],
    },
    {
      icon: <Briefcase size={32} style={{ color: dynamicColor }} />,
      title: "Corporate",
      subtitle: "Companies & Enterprises",
      points: [
        "HR announcements",
        "Interview scheduling",
        "Shift change notifications",
        "Internal communications",
      ],
    },
    {
      icon: <ShoppingCart size={32} style={{ color: dynamicColor }} />,
      title: "E-commerce",
      subtitle: "Retail & Online Stores",
      points: [
        "Order confirmations",
        "Delivery tracking updates",
        "Promotional campaigns",
        "Customer support",
      ],
    },
  ];

  return (
    <section
      className="py-20 px-6 sm:px-12 lg:px-20"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Services
        </h2>
        <p
          className="mt-4"
          style={{ color: "var(--color-text)" }}
        >
          Tailored communication solutions designed for multiple industries.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-left hover:scale-105 transition transform"
          >
            <div className="flex items-center gap-3 mb-4">
              {service.icon}
              <div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {service.subtitle}
                </p>
              </div>
            </div>
            <ul className="text-sm space-y-2">
              {service.points.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2"
                  style={{ color: "var(--color-text)" }}
                >
                  <Circle
                    size={10}
                    style={{ color: "var(--color-text)" }}
                    className="mt-1 flex-shrink-0"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Custom integrations note */}
      <div className="text-center mt-16">
        <Sparkles
          size={28}
          style={{ color: dynamicColor }}
          className="mx-auto mb-2"
        />
        <p
          className="text-lg"
          style={{ color: "var(--color-text)" }}
        >
          Built for enterprise-grade reliability with the flexibility to adapt
          to any industry's unique requirements
        </p>
      </div>
    </section>
  );
}
