"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaInfoCircle,
  FaNewspaper,
  FaImages,
  FaUsers,
  FaDownload,
  FaEnvelope,
  FaBars,
  FaRocket,
} from "react-icons/fa";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: FaHome,
  },
  {
    name: "About",
    href: "/about",
    icon: FaInfoCircle,
  },
  {
    name: "News",
    href: "/news",
    icon: FaNewspaper,
  },
  {
    name: "Into the Future",
    href: "/projects",
    icon: FaRocket,
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: FaImages,
  },
  {
    name: "Faculty",
    href: "/faculty",
    icon: FaUsers,
  },
  {
    name: "Downloads",
    href: "/downloads",
    icon: FaDownload,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: FaEnvelope,
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 xl:gap-3 shrink-0"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
            />

            <div>
              <h1 className="text-base xl:text-2xl font-bold text-slate-900 whitespace-nowrap">
                Nazareno Elementary School
              </h1>
              <p className="text-xs text-slate-500">
                Official School Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Optimized gaps and font sizing */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 px-2 py-2 xl:px-3 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-xs xl:text-sm whitespace-nowrap"
                >
                  <Icon className="text-xs xl:text-sm shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-2xl text-slate-700"
            aria-label="Toggle Menu"
          >
            <FaBars />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileOpen
              ? "max-h-[500px] opacity-100 translate-y-0 py-4 border-t"
              : "max-h-0 opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex flex-col gap-2 px-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-2 transition-all duration-300"
                >
                  <Icon />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}