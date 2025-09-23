import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-20 transition-colors"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div
        className="
          max-w-2xl w-full p-10 rounded-2xl shadow-xl border
          border-[var(--color-text)]/10 bg-[var(--color-bg-alt,transparent)]
          backdrop-blur-md
        "
        style={{ color: "var(--color-text)" }}
      >
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="opacity-80 mb-10">
          Have questions? Fill out the form below and we’ll get back to you.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-lg transition
              bg-[var(--color-bg-input,#f9f9f9)] text-[var(--color-text)]
              placeholder-[var(--color-text)]/60
              focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]
            "
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full px-4 py-3 rounded-lg transition
              bg-[var(--color-bg-input,#f9f9f9)] text-[var(--color-text)]
              placeholder-[var(--color-text)]/60
              focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]
            "
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="
              w-full px-4 py-3 rounded-lg transition
              bg-[var(--color-bg-input,#f9f9f9)] text-[var(--color-text)]
              placeholder-[var(--color-text)]/60
              focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]
            "
            required
          />
          <button
            type="submit"
            className="
              w-full px-6 py-3 rounded-2xl font-semibold transition
              bg-[var(--color-brand)] text-white shadow-lg
              hover:scale-105 hover:shadow-xl hover:opacity-90 active:scale-95
            "
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm opacity-80">
          <div className="flex flex-col items-center">
            <Mail className="w-6 h-6 mb-2 text-[var(--color-brand)]" />
            <span>info@comms.com</span>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="w-6 h-6 mb-2 text-[var(--color-brand)]" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="w-6 h-6 mb-2 text-[var(--color-brand)]" />
            <span>123 Business Rd, NY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
