// About.jsx
export default function About() {
    return (
      <section
        className="min-h-screen flex items-center justify-center px-6 py-20"
        style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <div className="max-w-4xl text-center space-y-8">
          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl font-extrabold"
            style={{ color: "var(--color-text)" }}
          >
            About Us
          </h1>
  
          {/* Divider line */}
          <div className="w-24 h-1 mx-auto rounded-full" style={{ background: "var(--color-brand)" }} />
  
          {/* Content */}
          <p className="text-lg sm:text-xl opacity-80 leading-relaxed">
            At <span className="font-bold">Comms</span>, we believe in simplifying
            communication for organizations of every size. Our mission is to
            provide reliable, secure, and scalable solutions that empower schools,
            hospitals, companies, and communities to stay connected.
          </p>
  
          <p className="text-lg opacity-80 leading-relaxed">
            With our unified platform — covering SMS, WhatsApp, email, and voice —
            we help organizations streamline workflows, improve engagement, and
            build stronger relationships with the people that matter most.
          </p>
        </div>
      </section>
    );
  }
  