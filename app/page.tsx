"use client";
import NavBar from "@/components/nav-bar";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative">
        {/* Background gradient - updated with blue color */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-blue-800 to-red-600 z-0" />

        {/* Content */}
        <div className="relative z-10">
          <NavBar />
          <HeroSection />
        </div>
      </div>
    </main>
  );
}
