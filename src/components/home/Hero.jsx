import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5">
          Nazareno Elementary School
        </h1>

        <div className="inline-block bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-full mb-6 shadow-lg">
          Basta Taga-Nazareno, Madinanon Disiplinado
        </div>

        <p className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Nurturing Excellence, Building Futures.
        </p>

        <p className="text-lg md:text-xl text-slate-200 max-w-4xl mx-auto mb-10 leading-relaxed">
          Preparing learners through quality
          education, strong values, and a
          culture of discipline, leadership,
          and lifelong learning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/about"
            className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-xl"
          >
            Learn More
          </Link>

          <Link
            href="/contact"
            className="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}