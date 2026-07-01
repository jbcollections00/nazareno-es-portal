import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 bg-blue-900 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold">
          Join Our Learning Community
        </h2>

        <p className="mt-6 text-xl text-blue-100">
          Discover opportunities, excellence, and a brighter
          future at Nazareno Elementary School.
        </p>

        <Link
          href="/contact"
          className="inline-block mt-8 bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          Contact Us
        </Link>

      </div>
    </section>
  );
}