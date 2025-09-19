// src/pages/Dashboard.jsx
import { Outlet, Link } from "react-router-dom";

export default function Dashboard() {
  const steps = [
    { name: "Contacts", path: "contacts" },
    { name: "Templates", path: "templates" },
    { name: "Messaging", path: "messaging" },
    { name: "Analytics", path: "analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Sidebar */}
      <div className="w-64 p-6 border-r border-[var(--color-text)]/10">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {steps.map((step) => (
            <li key={step.name}>
              <Link
                to={step.path}
                className="block px-4 py-2 rounded-lg hover:bg-[var(--color-bg-alt)] transition"
              >
                {step.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <Outlet />
      </div>
    </div>
  );
}
