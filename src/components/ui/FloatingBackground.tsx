"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  Target,
  BarChart3,
  GraduationCap,
  BookOpen,
  Brain,
  Lightbulb,
  Compass,
  Trophy,
  Atom,
  Calculator,
  BriefcaseBusiness,
  Code2,
  ChartNoAxesCombined,
  Sparkles,
  School,
} from "lucide-react";

const icons = [
  {
    icon: FlaskConical,
    position: "left-[6%] top-[8%]",
    style: "purple",
  },
  {
    icon: Target,
    position: "right-[7%] top-[12%]",
    style: "emerald",
  },
  {
    icon: BarChart3,
    position: "left-[9%] top-[25%]",
    style: "yellow",
  },
  {
    icon: GraduationCap,
    position: "right-[10%] top-[30%]",
    style: "pink",
  },
  {
    icon: BookOpen,
    position: "left-[4%] top-[42%]",
    style: "blue",
  },
  {
    icon: Brain,
    position: "right-[5%] top-[45%]",
    style: "purple",
  },
  {
    icon: Lightbulb,
    position: "left-[11%] top-[55%]",
    style: "yellow",
  },
  {
    icon: Compass,
    position: "right-[9%] top-[58%]",
    style: "cyan",
  },
  {
    icon: Trophy,
    position: "left-[5%] top-[68%]",
    style: "orange",
  },
  {
    icon: Atom,
    position: "right-[6%] top-[72%]",
    style: "blue",
  },
  {
    icon: Calculator,
    position: "left-[10%] top-[80%]",
    style: "emerald",
  },
  {
    icon: BriefcaseBusiness,
    position: "right-[11%] top-[82%]",
    style: "pink",
  },
  {
    icon: Code2,
    position: "left-[4%] top-[91%]",
    style: "purple",
  },
  {
    icon: ChartNoAxesCombined,
    position: "right-[5%] top-[94%]",
    style: "yellow",
  },
  {
    icon: Sparkles,
    position: "left-[15%] top-[35%]",
    style: "pink",
  },
  {
    icon: School,
    position: "right-[15%] top-[65%]",
    style: "cyan",
  },
];

const styles = {
  purple:
    "border-purple-500/20 bg-purple-500/10 text-purple-400",
  emerald:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  yellow:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  pink:
    "border-pink-500/20 bg-pink-500/10 text-pink-400",
  blue:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  cyan:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  orange:
    "border-orange-500/20 bg-orange-500/10 text-orange-400",
};

export default function FloatingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {icons.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={index}
            className={`absolute ${item.position}  h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-md flex ${
              styles[item.style as keyof typeof styles]
            }`}
            animate={{
              y: [0, -12, 0, 10, 0],
              x: [0, 4, -4, 3, 0],
              rotate: [0, 2, -2, 1, 0],
            }}
            transition={{
              duration: 5 + (index % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.25,
            }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        );
      })}
    </div>
  );
}