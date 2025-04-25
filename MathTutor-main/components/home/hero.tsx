"use client";

import { useState } from "react";
import { GradientRing } from "@/components/ui/gradient-ring";
import { AnimatedHeroContent } from "@/components/ui/animated-hero-content";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8F9]">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Image src="/MathPi.png" height={70} width={70} alt="mathpi logo" />
              <div className="hidden md:flex items-center space-x-8">
                {/* Features (Dropdown) */}
                {[{name: "Home", to:"#"}, {name: "AI Learning", to: "#ailearning"}].map((link) => (
                  <a key={link.name} href={link.to} className="text-sm text-gray-600 hover:text-purple-500 transition-colors">
                    {link.name}
                  </a>
                ))}
                <div
                  className="relative flex items-center space-x-1 cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="text-sm text-gray-600 hover:text-purple-500 transition-colors">
                    Features
                  </span>
                  <ChevronDown size={16} className="text-gray-600" />

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute left-0 top-9 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200"
                      >
                        <ul className="space-y-1 text-gray-700">
                          {[
                            "Step-by-Step Solution",
                            "Interactive Tutorial",
                            "AI-Powered Problem Solving",
                            "Roadmaps",
                            "Progress Tracking",
                            "Gamified Learning Experience",
                          ].map((item, index) => (
                            <li
                              key={index}
                              className="px-4 py-2 hover:text-purple-500 transition-colors rounded-md"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {[{name: "Get Started", to: "#getstarted"}].map((link) => (
                  <a key={link.name} href={link.to} className="text-sm text-gray-600 hover:text-purple-500 transition-colors">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm border-blue-200 hover:bg-blue-50 transition-colors">
                Login →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 overflow-hidden">
        <GradientRing className="left-[-300px] top-[20%] pointer-events-none hidden md:block" />
        <GradientRing className="right-[-300px] bottom-[20%] pointer-events-none hidden md:block" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedHeroContent />
        </div>
      </section>
    </div>
  );
}
