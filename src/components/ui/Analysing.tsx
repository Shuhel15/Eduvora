
"use client";

import { Container } from "../container";
import { motion } from "framer-motion";

export default function Analysing() {
  return (
    <Container>
      <main className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-300 border-t-blue-500 " />

          <p className="text-lg font-semibold text-black dark:text-white">
            AI is Analysing & showing your result ...
          </p>

          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Analysing your interests & marks...
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <p className="w-fit animate-pulse rounded-full border border-purple-500 bg-purple-500/25 px-3 py-1 text-sm text-purple-500">
              Reading answers
            </p>

            <p className="w-fit animate-pulse rounded-full border border-pink-500  bg-pink-500/25 text-pink-500 px-3 py-1 text-sm">
              Matching careers
            </p>

            <p className="w-fit animate-pulse rounded-full border border-emerald-500 bg-emerald-500/25 text-emerald-500 px-3 py-1 text-sm">
              Building roadmap
            </p>
          </div>
        </motion.div>
      </main>
    </Container>
  );
}


