// src/pages/Dashboard.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { Users, FileText, Send, BarChart2 } from "lucide-react";

export default function Dashboard() {
  const location = useLocation();

  const steps = [
    { name: "Contacts", path: "contacts", icon: Users },
    { name: "Templates", path: "templates", icon: FileText },
    { name: "Messaging", path: "messaging", icon: Send },
    { name: "Analytics", path: "analytics", icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Sidebar (fixed with shadow) */}
      <div className="">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <ul className="space-y-2">
          {steps.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname.includes(path);
            return (
              <li key={name}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-[var(--color-brand)] text-white shadow"
                      : "hover:bg-[var(--color-bg)]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content (scrollable) */}
      <div className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
