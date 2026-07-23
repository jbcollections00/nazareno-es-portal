"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaNewspaper,
  FaImages,
  FaDownload,
  FaFolder,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
  FaChevronRight,
  FaRocket,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [openMenus, setOpenMenus] = useState(() => {
    if (typeof window === "undefined") return { downloads: true };
    const saved = localStorage.getItem("sidebar-open-menus");
    return saved ? JSON.parse(saved) : { downloads: true };
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem("sidebar-open-menus", JSON.stringify(openMenus));
  }, [openMenus]);

  useEffect(() => {
    async function loadMessageCount() {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });
      setMessageCount(count || 0);
    }
    loadMessageCount();
  }, []);

  useEffect(() => {
    async function checkUser() {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setLoading(false);
    }
    checkUser();
  }, [pathname, router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      href: "/admin/faculty",
      label: "Faculty",
      icon: <FaChalkboardTeacher />,
    },
    {
      href: "/admin/news",
      label: "News",
      icon: <FaNewspaper />,
    },
    {
      href: "/admin/projects",
      label: "Projects",
      icon: <FaRocket />,
    },
    {
      href: "/admin/albums",
      label: "Albums",
      icon: <FaImages />,
    },
    {
      href: "/admin/messages",
      label: "Messages",
      count: messageCount,
      icon: <FaEnvelope />,
    },
    {
      key: "downloads",
      label: "Downloads",
      icon: <FaDownload />,
      children: [
        { href: "/admin/downloads", label: "Files" },
        {
          href: "/admin/download-folders",
          label: "Folders",
          icon: <FaFolder />,
        },
      ],
    },
  ];

  function renderMenu(items, level = 0) {
    return items.map((item) => {
      if (item.children) {
        const isOpen = openMenus[item.key];
        return (
          <div key={item.key}>
            <button
              onClick={() =>
                setOpenMenus((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
              }
              title={collapsed ? item.label : ""}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                !collapsed && isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`${level === 0 ? "ml-8" : "ml-6"} mt-2 flex flex-col gap-2`}
              >
                {renderMenu(item.children, level + 1)}
              </div>
            </div>
          </div>
        );
      }

      const active = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          title={collapsed ? item.label : ""}
          className={`flex items-center justify-between px-3 py-3 rounded-lg transition ${
            active
              ? "bg-yellow-400 text-blue-900 font-semibold"
              : "hover:bg-blue-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon && item.icon}
            {!collapsed && <span>{item.label}</span>}
          </div>
          {!collapsed && item.count > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {item.count}
            </span>
          )}
        </Link>
      );
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  if (pathname === "/admin/login") return children;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`bg-blue-900 text-white p-6 flex flex-col transition-all duration-500 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo and Admin Panel Header with Hamburger Next to It */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="School Logo"
            width={100}
            height={100}
            className={`rounded-full aspect-square object-cover transition-all duration-300 ${
              collapsed ? "w-10 h-10 mb-2" : "w-24 h-24 mb-4"
            }`}
            priority
          />

          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between w-full px-1"
            }`}
          >
            {!collapsed && (
              <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg hover:text-yellow-400 transition"
              title="Toggle Sidebar"
            >
              <FaBars />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-2">{renderMenu(menuItems)}</nav>

        <button
          onClick={logout}
          title={collapsed ? "Logout" : ""}
          className="mt-auto flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}