import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaAward,
} from "react-icons/fa";

const stats = [
  {
    value: "59",
    label: "Learners",
    icon: FaUserGraduate,
    color: "from-blue-600 to-blue-800",
  },
  {
    value: "5",
    label: "Teachers",
    icon: FaChalkboardTeacher,
    color: "from-green-600 to-green-800",
  },
  {
    value: "4",
    label: "Classrooms",
    icon: FaSchool,
    color: "from-purple-600 to-purple-800",
  },
  {
    value: "40+",
    label: "Years of Service",
    icon: FaAward,
    color: "from-yellow-500 to-orange-600",
  },
];

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            School at a Glance
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Building a brighter future through
            quality education, dedicated
            service, and academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`
                  bg-gradient-to-br ${stat.color}
                  rounded-3xl
                  p-8
                  text-white
                  shadow-xl
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  text-center
                `}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="text-5xl" />
                  </div>
                </div>

                <h3 className="text-5xl font-extrabold mb-3">
                  {stat.value}
                </h3>

                <p className="text-lg font-medium text-white/95">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}