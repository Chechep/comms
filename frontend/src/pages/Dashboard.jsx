import { Outlet, Link, useLocation } from "react-router-dom";
import { Users, FileText, Send, BarChart2 } from "lucide-react";
import Chatbot from "../components/Chatbot";

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
      {/* Sidebar */}
      <div className="w-64 p-6 border-r border-[var(--color-border)]">
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
                      : "hover:bg-[var(--color-bg-alt)]"
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

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </div>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}
