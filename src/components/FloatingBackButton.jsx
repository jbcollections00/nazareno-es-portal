"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function FloatingBackButton({ fallbackUrl = "/news" }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how close the user is to the bottom of the document
      const currentScrollPosition = window.innerHeight + window.scrollY;
      const totalPageHeight = document.documentElement.scrollHeight;
      
      // If the user is within 400px of the footer area, hide it
      if (totalPageHeight - currentScrollPosition < 400) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <div className={`fixed top-28 left-0 right-0 pointer-events-none z-50 transition-all duration-300 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
    }`}>
      <div className="max-w-7xl mx-auto px-6 relative w-full">
        <button
          onClick={handleBack}
          className="pointer-events-auto absolute left-6 lg:-left-4 inline-flex items-center gap-2 bg-white/95 backdrop-blur text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-xl transition-all hover:bg-white border border-slate-200 hover:shadow-2xl transform hover:-translate-y-0.5 active:scale-95"
        >
          <FaArrowLeft className="text-xs" />
          Back
        </button>
      </div>
    </div>
  );
}