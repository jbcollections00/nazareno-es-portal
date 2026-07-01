import Link from "next/link";
import Image from "next/image";
import {
  FaHome,
  FaInfoCircle,
  FaNewspaper,
  FaImages,
  FaDownload,
  FaChalkboardTeacher,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Nazareno Elementary School Logo"
                width={60}
                height={60}
                className="rounded-full bg-white p-1"
              />

              <div>
                <h3 className="text-xl font-bold">
                  Nazareno Elementary School
                </h3>
              </div>
            </div>

            <p className="text-slate-300">
              Providing quality education for
              all learners.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">
              Quick Links
            </h4>

            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaHome />
                Home
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaInfoCircle />
                About
              </Link>

              <Link
                href="/news"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaNewspaper />
                News
              </Link>

              <Link
                href="/gallery"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaImages />
                Gallery
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">
              Resources
            </h4>

            <div className="space-y-3">
              <Link
                href="/downloads"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaDownload />
                Downloads
              </Link>

              <Link
                href="/faculty"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaChalkboardTeacher />
                Faculty
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <FaEnvelope />
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">
              Contact Information
            </h4>

            <div className="space-y-3 text-slate-300">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1" />
                <span>
                  Barangay Nazareno
                  <br />
                  Gubat, Sorsogon
                  <br />
                  Philippines
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaEnvelope />
                <span>
                  114214@deped.gov.ph
                </span>
              </div>

              <a
                href="https://www.facebook.com/profile.php?id=100092447396923"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <FaFacebook />
                Nazareno Elem School
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-6 text-center text-slate-400">
          © {new Date().getFullYear()} Nazareno
          Elementary School
        </div>
      </div>
    </footer>
  );
}
