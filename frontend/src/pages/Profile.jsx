import { useState } from "react";
import { User } from "lucide-react";

export default function Profile() {
  const [userInfo] = useState({
    name: "John Doe",
    email: "john.doe@gmail.com",
    role: "Administrator",
    joined: "Jan 2025",
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[var(--color-bg-alt)] border border-[var(--color-text)]/10 rounded-xl shadow-md backdrop-blur-md">
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 bg-[var(--color-bg)] rounded-full flex items-center justify-center text-4xl">
          <User size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{userInfo.name}</h1>
          <p className="text-sm opacity-80">{userInfo.role}</p>
          <p className="text-sm opacity-60">Joined: {userInfo.joined}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={userInfo.name}
            readOnly
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-text)]/20 bg-[var(--color-bg)] text-[var(--color-text)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={userInfo.email}
            readOnly
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-text)]/20 bg-[var(--color-bg)] text-[var(--color-text)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            type="text"
            value={userInfo.role}
            readOnly
            className="w-full px-4 py-2 rounded-lg border border-[var(--color-text)]/20 bg-[var(--color-bg)] text-[var(--color-text)]"
          />
        </div>
      </div>

      <button
        className="mt-6 px-6 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition"
      >
        Edit Profile
      </button>
    </div>
  );
}
