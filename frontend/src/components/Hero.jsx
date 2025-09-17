export default function Hero() {
    return (
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Comms
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Connecting industries with smarter communication solutions.
          </p>
          <a
            href="/services"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
          >
            Get Started
          </a>
        </div>
      </section>
    );
  }
  