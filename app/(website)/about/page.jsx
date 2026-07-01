import Image from "next/image";
import {
  FaSchool,
  FaBullhorn,
  FaEye,
  FaBullseye,
  FaHistory,
  FaPrayingHands,
  FaHandsHelping,
  FaLeaf,
  FaFlag,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            About Nazareno Elementary School
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Building a culture of excellence,
            discipline, and lifelong learning.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                <FaSchool className="text-white text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                School Profile
              </h2>
            </div>

            <p className="text-slate-700 leading-8">
              Nazareno Elementary School is a
              public elementary school committed
              to providing quality, inclusive,
              and learner-centered education.
              Through dedicated teachers,
              supportive stakeholders, and a
              nurturing learning environment,
              the school develops pupils into
              responsible, productive, and
              lifelong learners.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center">
                <FaHistory className="text-white text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                School History
              </h2>
            </div>

            <p className="text-slate-700 leading-8">
              Nazareno Elementary School has
              continuously served the learners
              of Barangay Nazareno and nearby
              communities through quality basic
              education. Through the years, the
              school has grown with the support
              of dedicated teachers, parents,
              local stakeholders, and community
              partners who share the vision of
              providing meaningful learning
              opportunities for every child.
            </p>

            <p className="text-slate-700 leading-8 mt-4">
              Today, the school remains
              committed to academic excellence,
              discipline, character formation,
              and community engagement while
              preparing learners to become
              responsible and productive
              citizens.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center">
                <FaSchool className="text-white text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                School Seal Meaning
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <Image
                src="/logo.png"
                alt="Nazareno Elementary School Logo"
                width={180}
                height={180}
                className="rounded-full border-4 border-blue-100"
              />

              <div className="space-y-4 text-slate-700 leading-8">
                <p>
                  The school seal represents
                  the identity, purpose, and
                  commitment of Nazareno
                  Elementary School in providing
                  quality education for every
                  learner.
                </p>

                <p>
                  It symbolizes academic
                  excellence, discipline,
                  leadership, service, and the
                  partnership between the school,
                  parents, and community in
                  nurturing future generations.
                </p>

                <p>
                  The seal serves as a reminder
                  of the school's mission to
                  develop responsible,
                  productive, and values-driven
                  learners who contribute
                  positively to society.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500 flex items-center justify-center">
                <FaBullhorn className="text-white text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                School Motto
              </h2>
            </div>

            <p className="text-xl font-semibold text-blue-900">
              Basta Taga-Nazareno, Madinanon
              Disiplinado
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                <FaEye className="text-white text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Vision
              </h2>
            </div>

            <p className="text-slate-700 leading-8">
              We dream of Filipinos who
              passionately love their country
              and whose values and competencies
              enable them to realize their full
              potential and contribute
              meaningfully to nation-building.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
                <FaBullseye className="text-white text-2xl" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Mission
              </h2>
            </div>

            <p className="text-slate-700 leading-8">
              To protect and promote the right
              of every Filipino to quality,
              equitable, culture-based, and
              complete basic education where
              learners learn in a child-friendly,
              gender-sensitive, safe, and
              motivating environment.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Core Values
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <FaPrayingHands className="text-white text-2xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Maka-Diyos
                  </h3>

                  <p className="text-slate-600">
                    God-centered and faithful.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-green-50 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
                  <FaHandsHelping className="text-white text-2xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Maka-Tao
                  </h3>

                  <p className="text-slate-600">
                    Respectful, compassionate,
                    and caring.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center">
                  <FaLeaf className="text-white text-2xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Makakalikasan
                  </h3>

                  <p className="text-slate-600">
                    Environmentally responsible.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-red-50 rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center">
                  <FaFlag className="text-white text-2xl" />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Makabansa
                  </h3>

                  <p className="text-slate-600">
                    Proud and responsible citizen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}