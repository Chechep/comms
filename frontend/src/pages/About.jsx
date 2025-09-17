// About.jsx
export default function About() {
    return (
      <section
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold drop-shadow-glow">About Us</h1>
          <p className="text-lg opacity-90">
            This is the About page. Add your company background and mission here.
          </p>
        </div>
      </section>
    );
  }
  