"use client";

import { GraduationCap, Map, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Whatweoffer() {
  const cards = [
    {
      icon: GraduationCap,
      color: "indigo",
      title: "AI-Powered Quiz",
      description: "Answer 10 smart questions about your interests and strengths.",
      bgHover: "hover:bg-indigo-400/20 hover:border-indigo-500 hover:shadow-indigo-400/40",
      iconBg: "bg-indigo-500/25",
      iconColor: "text-indigo-500",
    },
    {
      icon: Target,
      color: "emerald",
      title: "Personalized Recommendation",
      description: "Our AI maps your answers to the perfect stream, course, and career path for you.",
      bgHover: "hover:bg-emerald-400/20 hover:border-emerald-500 hover:shadow-emerald-400/40",
      iconBg: "bg-emerald-500/25",
      iconColor: "text-emerald-500",
    },
    {
      icon: TrendingUp,
      color: "yellow",
      title: "Career & Salary Insights",
      description: "Explore future jobs, average salaries, and growth scope.",
      bgHover: "hover:bg-yellow-400/20 hover:border-yellow-500 hover:shadow-yellow-400/40",
      iconBg: "bg-yellow-500/25",
      iconColor: "text-yellow-500",
    },
    {
      icon: Map,
      color: "pink",
      title: "Find Colleges Near You",
      description: "Google Maps shows top colleges offering your course nearby.",
      bgHover: "hover:bg-pink-400/40 hover:border-pink-500 hover:shadow-pink-400/40",
      iconBg: "bg-pink-500/25",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <motion.section
      id="whatweoffer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center mt-20"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="uppercase gap-2 flex items-center text-sm font-medium tracking-widest text-[#6366F1]"
      >
        <span className="h-0.5 w-5 bg-[#6366F1]" />
        what we offer
        <span className="h-0.5 w-5 bg-[#6366F1]" />
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-5xl text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl dark:text-white mt-10 mb-10"
      >
        Every thing you need to choose <span className="text-indigo-500">your path</span>
      </motion.h1>

      <div className="grid grid-cols sm:grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className={`border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 duration-200 transition-all bg-black/5 hover:shadow-lg hover:-translate-y-1 ${card.bgHover}`}
            >
              <div className={`${card.iconBg} rounded-xl p-2 w-fit`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold py-2">{card.title}</h3>
              <p className="text-sm text-black/50 dark:text-white/50">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

