"use client";

import { Compass, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-4 sm:mx-6 lg:mx-10 border-t-2 border-black/10 dark:border-white/10"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 py-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        <div className="max-w-xl">
          <Link
            href="/"
            aria-label="Eduvora footer"
            className="flex w-fit items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
          >
            <div className="group rounded-lg bg-linear-to-br from-purple-600 to-purple-500 p-1.5 text-white">
              <Compass
                size={25}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
            </div>
            Eduvora
          </Link>

          <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-black/50 dark:text-white/50">
            AI-powered career guidance for Class 10 & 12 students in India.
            Discover your perfect stream, course, and colleges near you.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <p className="w-fit rounded-full border border-purple-500 bg-purple-500/20 px-2 py-1 text-xs font-semibold text-purple-500">
              Free to use
            </p>

            <p className="w-fit rounded-full border border-purple-500 bg-purple-500/20 px-2 py-1 text-xs font-semibold text-purple-500">
              AI Powered
            </p>

            <p className="w-fit rounded-full border border-purple-500 bg-purple-500/20 px-2 py-1 text-xs font-semibold text-purple-500">
              No Ads
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="min-w-40">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
            Quick Links
          </h2>

          <div className="flex flex-col gap-2">
            <Link
              href="/#about"
              className="w-fit text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              About
            </Link>

            <Link
              href="/assessment/class"
              className="w-fit text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              Take Quiz
            </Link>

            <Link
              href="/dashboard"
              className="w-fit text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              My Dashboard
            </Link>

            <Link
              href="/colleges/nearby"
              className="w-fit text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              Find Colleges
            </Link>
          </div>
        </div>

        {/* For Students */}
        <div className="min-w-48">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">
            For Students
          </h2>

          <ul className="flex flex-col gap-2">
            <li className="w-fit cursor-pointer text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500">
              Class 10 Stream Guide
            </li>

            <li className="w-fit cursor-pointer text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500">
              Class 12 Course Guide
            </li>

            <li className="w-fit cursor-pointer text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500">
              Career Path Explorer
            </li>

            <li className="w-fit cursor-pointer text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500">
              Salary Insights
            </li>

            <li className="w-fit cursor-pointer text-[15px] text-black/50 transition-all duration-300 hover:translate-x-1 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500">
              College Finder
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 py-6 text-center">
          <p className="flex flex-wrap items-center justify-center gap-1 text-center text-sm font-medium text-black/50 dark:text-white/50">
            <span>© {new Date().getFullYear()} Eduvora</span>
            <span className="inline-flex items-center gap-1">
              Made with{" "}
              <Heart
                size={16}
                className="fill-red-400 text-red-400 animate-pulse"
              />{" "}
              for Indian students
            </span>

            <span>
              by{" "}
              <Link 
              href="https://shuhel.tech"
              className="font-semibold text-black/70 dark:text-white/70  hover:text-purple-500 dark:hover:text-purple-500 transition-colors duration-300">
                Shuhel Ahmed
              </Link>
            </span>
          </p>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link
              href="/privacy-policy"
              className="text-black/50 transition-colors duration-300 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              Privacy Policy
            </Link>

            <span className="text-black/20 dark:text-white/20">|</span>

            <Link
              href="/terms"
              className="text-black/50 transition-colors duration-300 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              Terms of Use
            </Link>

            <span className="text-black/20 dark:text-white/20">|</span>

            <Link
              href="mailto:shuhelahmed3789@gmail.com"
              className="text-black/50 transition-colors duration-300 hover:text-purple-500 dark:text-white/50 dark:hover:text-purple-500"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

