"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-6 px-8 md:px-16 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 relative mr-2">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <polygon
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                points="12,2 22,7 22,17 12,22 2,17 2,7"
              />
              <polygon
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                points="12,6 17,9 17,15 12,18 7,15 7,9"
              />
            </svg>
          </div>
          <div className="text-white text-xl font-medium">
            <span>GROUPE</span>
            <span className="font-bold">SOLAR</span>
          </div>
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden z-50 text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile menu - updated with blue color */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-blue-900/95 z-40 flex flex-col items-center justify-center md:hidden">
          <nav className="flex flex-col items-center space-y-8">
            <div className="relative">
              <button className="text-white flex items-center font-medium text-xl">
                GROUP INSURANCE
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button className="text-white flex items-center font-medium text-xl">
                PENSION PLAN
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button className="text-white font-medium text-xl">
                SERVICES
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop menu */}
      <nav className="hidden md:flex items-center space-x-8">
        <div className="relative group">
          <button className="text-white flex items-center font-medium">
            GROUP INSURANCE
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
        </div>
        <div className="relative group">
          <button className="text-white flex items-center font-medium">
            PENSION PLAN
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <button className="text-white font-medium">SERVICES</button>
        </div>
        <div className="h-6 border-l border-white/30 mx-2"></div>
      </nav>

      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-20">
        <button
          className="bg-red-500 text-white py-8 px-4 font-medium text-xs tracking-widest rotate-180"
          style={{ writingMode: "vertical-rl" }}
        >
          FREE TRIAL
        </button>
      </div>
    </header>
  );
}
