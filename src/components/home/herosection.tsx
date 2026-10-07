"use client";

import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Herosection() {
  const router = useRouter();

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center mt-20"
    >
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex w-full max-w-5xl flex-col items-center gap-5 sm:gap-6"
      >
        <h1
          aria-label="home"
          className="text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl dark:text-white"
        >
          <span className="text-purple-500">Discover</span> the career
          <br />
          <span className="text-pink-500">built for </span>
          <span className="text-emerald-500">you</span>
        </h1>

        <p className="max-w-xl px-2 text-sm font-medium leading-relaxed text-black/50 sm:max-w-2xl sm:text-base md:text-lg dark:text-white/50">
          Class 10 or 12 student? Take our AI-powered quiz and discover your
          personalized stream or course recommendations — along with career
          paths, salary insights, and nearby colleges.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 flex flex-row items-center justify-center gap-2.5 sm:mt-10 sm:gap-4"
      >
        <button
          onClick={() => router.push("/assessment/class")}
          className="group flex items-center gap-1.5 rounded-full border-2 border-purple-500 bg-purple-500/25 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-500/40 hover:shadow-lg hover:shadow-purple-500/40 active:scale-95 sm:gap-2 sm:px-8 sm:py-2.5 sm:text-lg"
        >
          Start Free Quiz
          <MoveRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 sm:h-5 sm:w-5" />
        </button>

        <Link
          href="/#process"
          className="rounded-full border-2 border-pink-500 bg-pink-500/25 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-500/40 hover:shadow-lg hover:shadow-pink-500/40 active:scale-95 sm:px-8 sm:py-2.5 sm:text-lg"
        >
          See how it works
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-9 flex w-full items-center justify-center sm:mt-10"
      >
        <div className="flex items-center justify-center">
          {/* Stat 1 */}
          <div className="border-r border-black/10 px-3 text-center dark:border-white/10 sm:px-8">
            <h2 className="text-xl font-black text-blue-500 sm:text-4xl">
              AI
            </h2>

            <p className="whitespace-nowrap text-[10px] font-medium text-black/50 sm:text-sm dark:text-white/50">
              Powered Guidance
            </p>
          </div>

          {/* Stat 2 */}
          <div className="border-r border-black/10 px-3 text-center dark:border-white/10 sm:px-8">
            <h2 className="whitespace-nowrap text-xl font-black text-emerald-500 sm:text-4xl">
              10th & 12th
            </h2>

            <p className="whitespace-nowrap text-[10px] font-medium text-black/50 sm:text-sm dark:text-white/50">
              Student Focused
            </p>
          </div>

          {/* Stat 3 */}
          <div className="px-3 text-center sm:px-8">
            <h2 className="whitespace-nowrap text-xl font-black text-violet-500 sm:text-4xl">
              1:1
            </h2>

            <p className="whitespace-nowrap text-[10px] font-medium text-black/50 sm:text-sm dark:text-white/50">
              Personalized Results
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
