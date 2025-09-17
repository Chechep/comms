import { GraduationCap, Stethoscope, Briefcase, ShoppingCart, Sparkles } from "lucide-react";

export default function Services({ darkMode, themeColor }) {
  // Dynamic color: themeColor in dark mode, gray-500 in light mode
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
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Services</h2>
        <p className="mt-4 text-white/80">
          Tailored communication solutions designed for multiple industries.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-left hover:scale-105 transition transform"
          >
            <div className="flex items-center gap-3 mb-4">
              {service.icon}
              <div>
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="text-sm text-white/70">{service.subtitle}</p>
              </div>
            </div>
            <ul className="text-sm text-white/90 space-y-2">
              {service.points.map((point, idx) => (
                <li key={idx}>• {point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Custom integrations note */}
      <div className="text-center mt-16">
        <Sparkles size={28} style={{ color: dynamicColor }} className="mx-auto mb-2" />
        <p className="text-white/90 text-lg">
        Built for enterprise-grade reliability with the flexibility to adapt to any industry's unique requirements
        </p>
      </div>
    </section>
  );
}
