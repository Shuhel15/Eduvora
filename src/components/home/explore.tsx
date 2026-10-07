"use client";

import {
  BriefcaseBusiness,
  BriefcaseMedical,
  FlaskConical,
  Monitor,
  Palette,
  Rocket,
  UserRoundCog,
} from "lucide-react";

import Link from "next/link";
import CountUp from "../ui/countup";
import { motion } from "framer-motion";

export default function Explore() {
  const streamCards = [
    {
      icon: FlaskConical,
      color: "emerald",
      title: "Science",
      subtitle: "Engineering · Medicine · Research",
      hoverClass: "hover:border-emerald-400 hover:bg-emerald-400/20 hover:shadow-emerald-400/40",
      iconBgClass: "bg-emerald-500/25",
      iconColorClass: "text-emerald-500",
    },
    {
      icon: BriefcaseBusiness,
      color: "yellow",
      title: "Commerce",
      subtitle: "CA · MBA · Finance · Banking",
      hoverClass: "hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-yellow-400/40",
      iconBgClass: "bg-yellow-500/25",
      iconColorClass: "text-yellow-500",
    },
    {
      icon: Palette,
      color: "pink",
      title: "Arts",
      subtitle: "Design · Law · Journalism · Psychology",
      hoverClass: "hover:border-pink-400 hover:bg-pink-400/20 hover:shadow-pink-400/40",
      iconBgClass: "bg-pink-500/25",
      iconColorClass: "text-pink-500",
    },
    {
      icon: Monitor,
      color: "indigo",
      title: "Technology",
      subtitle: "CS · Data Science · AI · Cybersecurity",
      hoverClass: "hover:border-indigo-400 hover:bg-indigo-400/20 hover:shadow-indigo-400/40",
      iconBgClass: "bg-indigo-500/25",
      iconColorClass: "text-indigo-500",
    },
    {
      icon: UserRoundCog,
      color: "orange",
      title: "Management",
      subtitle: "BBA · Marketing · HR · Entrepreneurship",
      hoverClass: "hover:border-orange-400 hover:bg-orange-400/20 hover:shadow-orange-400/40",
      iconBgClass: "bg-orange-500/25",
      iconColorClass: "text-orange-500",
    },
    {
      icon: BriefcaseMedical,
      color: "red",
      title: "Paramedical",
      subtitle: "Pharmacy · Nursing · Physiotherapy",
      hoverClass: "hover:border-red-400 hover:bg-red-400/20 hover:shadow-red-400/40",
      iconBgClass: "bg-red-500/25",
      iconColorClass: "text-red-500",
    },
  ];

  return (
    <motion.section
      id="explore"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-20 flex w-full flex-col items-center justify-center text-center "
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-pink-500 sm:text-sm"
      >
        <span className="h-0.5 w-5 bg-pink-500" />
        explore options
        <span className="h-0.5 w-5 bg-pink-500" />
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className=" mx-auto mt-8 mb-4 max-w-5xl text-center text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl md:text-6xl lg:text-7xl dark:text-white"
      >
        Every stream, every <span className="text-pink-500">career</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-10 max-w-2xl px-2 text-sm leading-6 text-black/50 sm:text-base md:text-lg dark:text-white/50"
      >
        Our AI covers all major streams and hundreds of courses.
      </motion.p>

      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {streamCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * idx }}
            >
              <Link
                href="/assessment/class"
                className={`block w-full rounded-xl border border-black/10 bg-black/5 p-4 text-start transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5 ${card.hoverClass}`}
              >
                <div className={`w-fit rounded-xl p-2 ${card.iconBgClass}`}>
                  <Icon className={`h-6 w-6 ${card.iconColorClass}`} />
                </div>

                <h3 className="py-2 text-lg font-semibold">{card.title}</h3>

                <p className="text-sm text-black/50 dark:text-white/50">
                  {card.subtitle}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className=" mt-20 mb-20 flex w-full max-w-6xl flex-col items-center justify-center rounded-3xl border border-indigo-500/20 bg-indigo-500/25 px-6 py-16  transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 sm:px-10 sm:py-20 dark:border-indigo-400/20 dark:bg-indigo-400/5 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-400/10"
      >
        <h1 className=" mx-auto mb-4 max-w-5xl text-center text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
          Your future starts with <span className="text-blue-500">one quiz</span>
        </h1>

        <p className=" mb-10 max-w-2xl px-2 text-center text-sm leading-6 text-black/50 sm:text-base md:text-lg dark:text-white/50">
          Free. Takes 3 minutes. Powered by AI. No career counsellor needed.
        </p>

        <Link
          href="/assessment/class"
          className=" group flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition-all duration-200 hover:-translate-y-1 hover:bg-indigo-500/90 hover:shadow-indigo-500/50 sm:text-base "
        >
          <Rocket className=" h-5 w-5 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 " />
          Take the Quiz - It&apos;s Free
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-10 mb-20 grid  w-full max-w-4xl grid-cols-2 gap-4 "
      >
        <div
          className=" flex min-h-31.25 flex-col items-center justify-center rounded-2xl border border-blue-500 bg-blue-500/25 px-6 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-blue-500/70 hover:bg-blue-500/15  dark:bg-blue-500/25 dark:hover:border-blue-400/70 dark:hover:bg-blue-400/15"
        >
          <h1 className="text-4xl font-black tracking-tight"><CountUp end={10}/></h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Smart Questions
          </p>
        </div>

        <div
          className=" flex min-h-31.25 flex-col items-center justify-center rounded-2xl border border-purple-500 bg-purple-500/25 px-6 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-purple-500/70 hover:bg-purple-500/15  dark:hover:border-purple-400/70 dark:hover:bg-purple-400/15 "
        >
          <h1 className="text-4xl font-black tracking-tight"><CountUp end={50}/>+</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Career Paths
          </p>
        </div>

        <div
          className=" flex min-h-31.25 flex-col items-center justify-center rounded-2xl border border-emerald-500 bg-emerald-500/25 px-6 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-emerald-500/70 hover:bg-emerald-500/15  dark:hover:border-emerald-400/70 dark:hover:bg-emerald-400/15 "
        >
          <h1 className="text-4xl font-black tracking-tight"><CountUp end={500}/>+</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Colleges
          </p>
        </div>

        <div
          className=" flex min-h-31.25 flex-col items-center justify-center rounded-2xl border border-orange-500 bg-orange-500/25 px-6 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-orange-500/70 hover:bg-orange-500/15  dark:hover:border-orange-400/70 dark:hover:bg-orange-400/15"
        >
          <h1 className="text-4xl font-black tracking-tight"><CountUp end={3}/> min</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            To get results
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

