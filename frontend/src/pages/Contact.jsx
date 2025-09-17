// Contact.jsx
import { useState } from "react";

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
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold mb-8 text-center drop-shadow-glow text-white">
          Contact Us
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand transition"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-brand transition"
            rows="5"
            required
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:scale-105 hover:animate-pulse transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
