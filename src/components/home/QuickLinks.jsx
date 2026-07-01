import Link from "next/link";
import {
  FaBullhorn,
  FaImages,
  FaUsers,
  FaDownload,
  FaArrowRight,
} from "react-icons/fa";

const links = [
  {
    title: "Announcements",
    description:
      "Latest school updates and notices",
    icon: FaBullhorn,
    href: "/news",
    bg: "from-blue-600 to-blue-800",
  },
  {
    title: "Gallery",
    description:
      "School events and activities",
    icon: FaImages,
    href: "/gallery",
    bg: "from-purple-600 to-purple-800",
  },
  {
    title: "Faculty",
    description:
      "Meet our teachers and staff",
    icon: FaUsers,
    href: "/faculty",
    bg: "from-green-600 to-green-800",
  },
  {
    title: "Downloads",
    description:
      "Forms and useful documents",
    icon: FaDownload,
    href: "/downloads",
    bg: "from-yellow-500 to-orange-600",
  },
];

export default function QuickLinks() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Quick Access
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Access important school
            resources, updates, services,
            and information with just one
            click.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.title}
                href={link.href}
                className="group"
              >
                <div
                  className={`
                    h-full
                    rounded-3xl
                    bg-gradient-to-br ${link.bg}
                    text-white
                    p-8
                    shadow-xl
                    hover:shadow-2xl
                    hover:-translate-y-2
                    transition-all
                    duration-300
                    text-center
                    flex
                    flex-col
                    items-center
                  `}
                >
                  <div className="w-28 h-28 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-8">
                    <Icon className="text-6xl" />
                  </div>

                  <h3 className="text-2xl font-bold text-center leading-tight px-2 mb-4">
                    {link.title}
                  </h3>

                  <p className="text-white/90 leading-relaxed mb-8">
                    {link.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 font-semibold text-lg mt-auto">
                    Explore

                    <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}