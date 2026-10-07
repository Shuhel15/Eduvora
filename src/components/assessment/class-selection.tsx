"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

type ClassLevel = "10" | "12";

export default function ClassSelection() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);

  function handleContinue() {
    if (!selectedClass) return;
    router.push(`/assessment/marks?class=${selectedClass}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <button
        type="button"
        onClick={() => setSelectedClass("10")}
        className={`group rounded-lg border-2 p-6 text-center transition-all ${
          selectedClass === "10"
            ? "border-purple-500 bg-purple-500/25"
            : "bg-purple-500/10! border-purple-500/25! duration-200 hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-400/40 active:scale-95 dark:border-white/20 dark:bg-black"
        }`}
      >
        <p className="text-sm font-semibold ">Secondary School</p>

        <h2 className="flex flex-col items-center mt-2 text-2xl font-black">
          <span className="p-3 rounded-xl bg-purple-600/30">
            <BookOpen size={30} className="text-white" />
          </span>
          Class 10
        </h2>

        <p className=" mt-3 text-sm text-black/50 dark:text-white/50">
          Choosing between Science, Commerce, and Arts streams.
        </p>
      </button>

      <button
        type="button"
        onClick={() => setSelectedClass("12")}
        className={`group rounded-lg border-2 p-6 text-center transition-all ${
          selectedClass === "12"
            ? "border-emerald-500 bg-emerald-500/25"
            : "bg-emerald-500/10! border-emerald-500/25! duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-400/40 active:scale-95 dark:border-white/20 dark:bg-black"
        }`}
      >
        <p className="text-sm font-semibold ">Senior Secondary School</p>

        <h2 className="flex flex-col items-center mt-2 text-2xl font-black">
          <span className="p-3 rounded-xl bg-emerald-700/60">
            <GraduationCap size={30} className="text-white" />
          </span>
          Class 12
        </h2>

        <p className="mt-3 text-sm text-black/50 dark:text-white/50">
          Get personalized course and career recommendations.
        </p>
      </button>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selectedClass}
        className="mt-4 w-full border rounded-lg border-black bg-black px-6 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 dark:border-white dark:bg-white dark:text-black active:scale-95 duration-200"
      >
        Continue
      </button>
    </motion.div>
  );
}

