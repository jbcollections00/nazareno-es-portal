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
  { name: "Home", href: "/", icon: FaHome },
  { name: "About", href: "/about", icon: FaInfoCircle },
  { name: "News", href: "/news", icon: FaNewspaper },
  { name: "Into the Future", href: "/projects", icon: FaRocket },
  { name: "Gallery", href: "/gallery", icon: FaImages },
  { name: "Faculty", href: "/faculty", icon: FaUsers },
  { name: "Downloads", href: "/downloads", icon: FaDownload },
  { name: "Contact", href: "/contact", icon: FaEnvelope },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2">
          
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 lg:w-11 lg:h-11 object-contain shrink-0"
            />

            <div className="shrink-0">
              <h1 className="text-sm lg:text-base xl:text-lg font-extrabold text-slate-900 tracking-tight">
                Nazareno Elementary School
              </h1>
              <p className="text-[9px] lg:text-[10px] xl:text-xs text-slate-500 font-medium">
                Official School Portal
              </p>
            </div>
          </Link>

          {/* 
            IBINALIK SA 'lg:flex'. 
            Pinaliit ang gap (gap-0.5) at padding (px-1.5) para magkasya ang 8 items sa smaller laptops.
          */}
          <nav className="hidden lg:flex items-center justify-end ml-auto gap-0.5 xl:gap-1 overflow-hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1 px-1.5 xl:px-2.5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-[11px] xl:text-sm whitespace-nowrap shrink-0"
                >
                  <Icon className="text-xs xl:text-sm shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* IBINALIK SA 'lg:hidden' ang hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-2xl text-slate-700 hover:text-blue-600 transition-colors shrink-0 ml-auto"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-2 transition-all duration-300"
                >
                  <Icon className="text-lg" />
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