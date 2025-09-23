import {
  GraduationCap,
  Stethoscope,
  Briefcase,
  Sparkles,
  Circle,
} from "lucide-react";

export default function Services({ darkMode, themeColor }) {
  const dynamicColor = darkMode ? themeColor : "#6b7280";

  const services = [
    {
      icon: <GraduationCap size={32} style={{ color: dynamicColor }} />,
      title: "Education",
      subtitle: "Schools & Universities",
      points: [
        "Alerts to parents, teachers and students",
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
        "Alerts to healthcare providers",
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
        "Internal communications",
        "Customer support"
      ],
    },
  ];

  return (
    <section
      className="py-12 px-6 sm:px-12 lg:px-20 transition-colors bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Services
        </h2>
        <p className="mt-2">
          Tailored communication solutions designed for multiple industries.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-left hover:scale-105 transition transform"
          >
            <div className="flex items-center gap-3 mb-4">
              {service.icon}
              <div>
                <h3 className="text-xl font-semibold">
                  {service.title}
                </h3>
                <p className="text-sm">
                  {service.subtitle}
                </p>
              </div>
            </div>
            <ul className="text-sm space-y-2">
              {service.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Circle
                    size={10}
                    className="mt-1 flex-shrink-0"
                    style={{ color: "var(--color-text)" }}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Custom integrations note */}
      <div className="text-center mt-12">
        <Sparkles
          size={28}
          style={{ color: dynamicColor }}
          className="mx-auto mb-2"
        />
        <p className="text-lg">
          Built for enterprise-grade reliability with the flexibility to adapt
          to any industry's unique requirements
        </p>
      </div>
    </section>
  );
}
