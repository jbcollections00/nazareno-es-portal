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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden pb-24">
      {/* Decorative Floating Gradient Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Nazareno Elementary School</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Building a culture of excellence, discipline, and lifelong learning.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-4 h-1.5 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* School Profile */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                <FaSchool className="text-white text-3xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                School Profile
              </h2>
            </div>
            <p className="text-slate-600 leading-loose text-lg">
              Nazareno Elementary School is a public elementary school committed to providing quality, inclusive, and learner-centered education. Through dedicated teachers, supportive stakeholders, and a nurturing learning environment, the school develops pupils into responsible, productive, and lifelong learners.
            </p>
          </div>

          {/* School History */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200 shrink-0">
                <FaHistory className="text-white text-3xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                School History
              </h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-loose text-lg">
              <p>
                Nazareno Elementary School has continuously served the learners of Barangay Nazareno and nearby communities through quality basic education. Through the years, the school has grown with the support of dedicated teachers, parents, local stakeholders, and community partners who share the vision of providing meaningful learning opportunities for every child.
              </p>
              <p>
                Today, the school remains committed to academic excellence, discipline, character formation, and community engagement while preparing learners to become responsible and productive citizens.
              </p>
            </div>
          </div>

          {/* School Seal Meaning */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 shrink-0">
                <FaSchool className="text-white text-3xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                School Seal Meaning
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="shrink-0 relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20"></div>
                <Image
                  src="/logo.png"
                  alt="Nazareno Elementary School Logo"
                  width={220}
                  height={220}
                  className="rounded-full border-8 border-white shadow-xl relative z-10"
                />
              </div>

              <div className="space-y-4 text-slate-600 leading-loose text-lg">
                <p>
                  The school seal represents the identity, purpose, and commitment of Nazareno Elementary School in providing quality education for every learner.
                </p>
                <p>
                  It symbolizes academic excellence, discipline, leadership, service, and the partnership between the school, parents, and community in nurturing future generations.
                </p>
                <p>
                  The seal serves as a reminder of the school's mission to develop responsible, productive, and values-driven learners who contribute positively to society.
                </p>
              </div>
            </div>
          </div>

          {/* Vibrant School Motto Highlight */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-indigo-200 border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <FaBullhorn className="text-white/80 text-5xl mx-auto mb-6 relative z-10" />
            <h2 className="text-sm font-bold text-indigo-200 uppercase tracking-[0.3em] mb-4 relative z-10">
              School Motto
            </h2>
            <p className="text-3xl md:text-5xl font-black text-white leading-tight relative z-10">
              "Basta Taga-Nazareno,<br className="hidden md:block"/> Madinanon Disiplinado"
            </p>
          </div>

          {/* Vision & Mission (2-Column Grid) */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                  <FaEye className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800">Vision</h2>
              </div>
              <p className="text-slate-600 leading-loose text-lg">
                We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to nation-building.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-200 shrink-0">
                  <FaBullseye className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800">Mission</h2>
              </div>
              <p className="text-slate-600 leading-loose text-lg">
                To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where learners learn in a child-friendly, gender-sensitive, safe, and motivating environment.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-white">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-slate-800 mb-4">
                Core Values
              </h2>
              <div className="w-16 h-1.5 bg-indigo-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Maka-Diyos */}
              <div className="group flex items-center gap-5 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-blue-100 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaPrayingHands className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-800 mb-1">Maka-Diyos</h3>
                  <p className="text-slate-500 font-medium">God-centered and faithful.</p>
                </div>
              </div>

              {/* Maka-Tao */}
              <div className="group flex items-center gap-5 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-green-100 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaHandsHelping className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-800 mb-1">Maka-Tao</h3>
                  <p className="text-slate-500 font-medium">Respectful, compassionate, and caring.</p>
                </div>
              </div>

              {/* Makakalikasan */}
              <div className="group flex items-center gap-5 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-800 mb-1">Makakalikasan</h3>
                  <p className="text-slate-500 font-medium">Environmentally responsible.</p>
                </div>
              </div>

              {/* Makabansa */}
              <div className="group flex items-center gap-5 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-red-100 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FaFlag className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-800 mb-1">Makabansa</h3>
                  <p className="text-slate-500 font-medium">Proud and responsible citizen.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}