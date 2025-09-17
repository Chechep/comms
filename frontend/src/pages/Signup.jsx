import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ org: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";
    if (name === "org" && !value.trim()) {
      error = "Organization username is required.";
    }
    if (name === "email" && !emailRegex.test(value)) {
      error = "Enter a valid email address.";
    }
    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters.";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
      setShakeFields((prev) => ({ ...prev, [name]: true }));
      setTimeout(() => setShakeFields((prev) => ({ ...prev, [name]: false })), 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    // Shake invalid fields
    const shake = {};
    Object.keys(newErrors).forEach((key) => {
      shake[key] = true;
      setTimeout(() => setShakeFields((prev) => ({ ...prev, [key]: false })), 300);
    });
    setShakeFields(shake);

    if (Object.keys(newErrors).length === 0) {
      alert("Signup successful!");
      navigate("/home");
    }
  };

  const handleGoogleSignup = () => {
    alert("Google signup clicked!");
    // Firebase Google Auth can go here
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Organization Username */}
          <div className={`relative ${errors.org && shakeFields.org ? "animate-shake" : ""}`}>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={20} />
            <input
              type="text"
              name="org"
              placeholder="Organization Username"
              value={formData.org}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-10 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand transition ${errors.org ? "border-red-500" : ""}`}
              required
            />
            {errors.org && <p className="text-red-600 text-sm mt-1">{errors.org}</p>}
          </div>

          {/* Email */}
          <div className={`relative ${errors.email && shakeFields.email ? "animate-shake" : ""}`}>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-10 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand transition ${errors.email ? "border-red-500" : ""}`}
              required
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={`relative ${errors.password && shakeFields.password ? "animate-shake" : ""}`}>
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-10 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand transition ${errors.password ? "border-red-500" : ""}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border rounded-lg shadow-md transition hover:shadow-[0_0_10px_var(--color-brand)] hover:scale-105"
            style={{ background: "var(--color-bg)", color: "#fff", borderColor: "#888" }}
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4 text-white/70">
          <hr className="flex-grow border-white/30" />
          <span className="px-2">or</span>
          <hr className="flex-grow border-white/30" />
        </div>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border rounded-lg shadow-md transition hover:shadow-[0_0_10px_var(--color-brand)] hover:scale-105"
          style={{ background: "var(--color-bg)", color: "#444", borderColor: "#888" }}
        >
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.5-50.4H272v95.3h146.9c-6.4 34.4-25 63.5-53.5 83.1v68h86.5c50.5-46.4 81.6-115.1 81.6-196z"/>
            <path fill="#34A853" d="M272 544.3c72.9 0 134-24.3 178.7-66.2l-86.5-68c-24 16-55 25.6-92.2 25.6-70.9 0-131-47.8-152.5-112.1h-89.7v70.4c44.3 88.2 135 150.3 242.2 150.3z"/>
            <path fill="#FBBC05" d="M119.3 326.1c-9.8-28.4-9.8-59 0-87.4V168.3h-89.7c-19 37.4-19 81.3 0 118.7l89.7 39.1z"/>
            <path fill="#EA4335" d="M272 107.1c38.9-.6 76.7 14.1 105.3 41.5l79-79.3C404.3 24.1 342.9-1.2 272 0 164.8 0 74.1 62.1 29.8 150.3l89.7 70.4c21.5-64.3 81.6-112.1 152.5-113.6z"/>
          </svg>
          Sign up with Google
        </button>

        <p className="text-white/70 text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/Login" className="text-brand hover:underline">
            Login
          </Link>
        </p>

        {/* Shake animation */}
        <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-5px); }
              40%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
              animation: shake 0.3s ease;
            }
          `}
        </style>
      </div>
    </section>
  );
}
