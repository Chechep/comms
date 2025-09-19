// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { auth, reauthenticateUser, db } from "../firebase";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile() {
  const currentUser = auth.currentUser;

  const [displayName, setDisplayName] = useState(currentUser?.displayName || "John Doe");
  const [editingName, setEditingName] = useState(false);

  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPlans, setShowPlans] = useState(false);
  const [userPlan, setUserPlan] = useState("");

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

  // Load user's current plan from Firestore
  useEffect(() => {
    if (!currentUser) return;
    const loadPlan = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserPlan(docSnap.data()?.plan || "");
      }
    };
    loadPlan();
  }, [currentUser]);

  const handleNameUpdate = async () => {
    if (!displayName) return alert("Name cannot be empty!");
    try {
      setLoading(true);
      await updateProfile(currentUser, { displayName });
      alert("Name updated successfully!");
      setEditingName(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) return alert("Fill in all fields!");
    try {
      setLoading(true);
      await reauthenticateUser(currentUser, currentPassword);
      await updatePassword(currentUser, newPassword);
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setEditingPassword(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planName) => {
    if (!currentUser) return alert("You must be logged in to select a plan!");
    try {
      setUserPlan(planName);
      await setDoc(doc(db, "users", currentUser.uid), { plan: planName }, { merge: true });
      alert(`Plan updated to ${planName}`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Get plan details for current plan
  const currentPlanDetails = plans.find((plan) => plan.name === userPlan);

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-[var(--color-bg-alt)] border border-[var(--color-text)]/10 rounded-xl shadow-md backdrop-blur-md">
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 bg-[var(--color-bg)] rounded-full flex items-center justify-center text-4xl">
          <User size={40} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-sm opacity-80">{currentUser?.email}</p>
        </div>
      </div>

      {/* Current Plan */}
      {currentPlanDetails && (
        <div className="mb-6 p-4 border border-[var(--color-text)]/20 rounded-lg bg-[var(--color-bg)]">
          <h2 className="font-bold text-lg">Current Plan: {currentPlanDetails.name}</h2>
          <p className="text-sm opacity-70">{currentPlanDetails.price}</p>
          <p className="text-sm opacity-70">{currentPlanDetails.description}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Edit Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          {editingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter new name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-text)]/20 bg-[var(--color-bg)] text-[var(--color-text)]"
              />
              <button
                onClick={handleNameUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:scale-105 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition"
            >
              Edit Name
            </button>
          )}
        </div>

        {/* Change Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          {!editingPassword ? (
            <button
              onClick={() => setEditingPassword(true)}
              className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-text)]/20 bg-[var(--color-bg)] text-[var(--color-text)]"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-text)]/20 bg-[var(--color-bg)] text-[var(--color-text)]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition flex-1"
                >
                  {loading ? "Updating..." : "Save Password"}
                </button>
                <button
                  onClick={() => setEditingPassword(false)}
                  className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:scale-105 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manage Plan */}
      <button
        onClick={() => setShowPlans(!showPlans)}
        className="mt-6 px-6 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition"
      >
        Manage Plan
      </button>

      {/* Inline Plan Selection */}
      {showPlans && (
        <div className="mt-4 space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border border-[var(--color-text)]/20 rounded-lg p-4 bg-[var(--color-bg)] ${
                userPlan === plan.name ? "ring-2 ring-[var(--color-brand)]" : ""
              }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-sm opacity-70 mb-2">{plan.description}</p>
              <p className="font-semibold mb-2">{plan.price}</p>
              <ul className="list-disc pl-5 mb-2">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="text-sm opacity-80">{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelect(plan.name)}
                className="px-4 py-2 rounded-lg bg-[var(--color-brand)] text-white hover:scale-105 transition"
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
