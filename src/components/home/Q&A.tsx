"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  Search,
  Sparkles,
  HelpCircle,
  MoveRight,
  X,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  id: number;
  category: "streams" | "courses" | "general" | "ai";
  categoryName: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "streams",
    categoryName: "Class 10 Stream",
    question: "Which stream should I choose after 10th class?",
    answer:
      "The choice between Science, Commerce, and Humanities depends on your interests, strengths, and future career goals alongside your academic scores. Eduvora recommends the most suitable stream based on your personalized AI assessment.",
  },
  {
    id: 2,
    category: "courses",
    categoryName: "Class 12 Course",
    question: "Which course is best for me after Class 12?",
    answer:
      "The ideal course is one that aligns with your passions, academic strengths, and career aspirations. Eduvora analyzes your profile and suggests recommended courses along with an AI match percentage.",
  },
  {
    id: 3,
    category: "general",
    categoryName: "Career Guidance",
    question: "Can high academic marks alone guarantee a successful career?",
    answer:
      "While marks are important, skills, genuine interest, consistency, and practical knowledge are equally critical for a successful career. Choosing the right direction matters most.",
  },
  {
    id: 4,
    category: "general",
    categoryName: "Career Planning",
    question: "When should I start planning for my career?",
    answer:
      "The earlier you start career planning, the better. Exploring interests from Class 10 and focusing on courses, entrance exams, and relevant skills during Class 11-12 gives you a strong head start.",
  },
  {
    id: 5,
    category: "ai",
    categoryName: "Eduvora AI",
    question: "How does the Eduvora AI Quiz work?",
    answer:
      "The Eduvora AI Quiz analyzes your responses to 10-15 smart interest-based questions and uses advanced algorithms to deliver personalized stream choices, course recommendations, and career salary insights.",
  },
  {
    id: 6,
    category: "courses",
    categoryName: "Colleges Search",
    question: "Can I find top colleges near my location?",
    answer:
      "Yes! Eduvora integrates with Google Maps to locate and showcase top engineering, medical, commerce, and degree colleges near your area.",
  },
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "streams", label: "Class 10 Streams" },
  { id: "courses", label: "Class 12 Courses" },
  { id: "ai", label: "AI & Quiz" },
  { id: "general", label: "Career Guidance" },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="faq" className="mx-auto w-full max-w-5xl px-4 py-20">
      <div className="flex flex-col items-center text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-purple-500 sm:text-sm">
          <span className="h-0.5 w-5 bg-purple-500" />
          Got Questions?
          <span className="h-0.5 w-5 bg-purple-500" />
        </p>

        <h2 className="mx-auto mt-6 mb-4 max-w-4xl text-center text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
          Frequently Asked <span className="text-purple-500">Questions</span>
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-6 text-black/50 sm:text-base md:text-lg dark:text-white/50">
          Clear, direct, and straightforward answers to all your common questions about education and career planning.
        </p>
      </div>

      <div className="mb-10 space-y-6">
        <div className="relative mx-auto max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-black/40 dark:text-white/40">
            <Search className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords (e.g. stream, course, marks)..."
            className="w-full rounded-2xl border border-black/10 bg-black/5 py-3.5 pl-11 pr-10 text-sm font-medium text-black placeholder:text-black/40 shadow-xs backdrop-blur-md transition-all duration-200 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-purple-400 dark:focus:bg-black/60"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(0);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer sm:text-sm ${
                  isActive
                    ? "border-2 border-purple-500 bg-purple-500/20 text-purple-500 shadow-md shadow-purple-500/20 dark:text-purple-300"
                    : "border border-black/10 bg-black/5 text-black/70 hover:bg-black/10 hover:text-black dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-black/5 p-10 text-center dark:border-white/10 dark:bg-white/5">
          <HelpCircle className="mx-auto h-10 w-10 text-purple-500/60" />
          <h3 className="mt-3 text-lg font-bold">No questions found</h3>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            No questions match your search query. Try searching for different keywords or resetting filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-purple-500 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-purple-500 bg-purple-500/10 text-black shadow-lg shadow-purple-500/10 dark:border-purple-500/80 dark:bg-purple-500/15 dark:text-white"
                    : "border-black/10 bg-black/5 text-black hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-purple-500/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-purple-400/40 dark:hover:bg-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isOpen
                          ? "bg-purple-500 text-white shadow-md shadow-purple-500/40"
                          : "border border-purple-500/30 bg-purple-500/15 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex flex-col gap-1">
                      <span className="w-fit rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-300">
                        {faq.categoryName}
                      </span>
                      <span className="text-sm font-bold leading-6 sm:text-base md:text-lg">
                        {faq.question}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-purple-500 text-white rotate-180"
                        : "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 pt-1 sm:px-7 sm:pb-7">
                      <div className="rounded-xl border border-purple-500/20 bg-white/60 p-4.5 text-sm leading-relaxed text-black/70 backdrop-blur-xs sm:text-base dark:border-purple-400/20 dark:bg-black/30 dark:text-white/70">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-16 flex w-full flex-col items-center justify-between gap-6 rounded-3xl border border-pink-500 bg-pink-500/25 p-6 sm:p-8 md:flex-row  ">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/25 text-pink-500 ">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white sm:text-xl">
              Still have questions?
            </h3>
            <p className="mt-1 text-xs text-black/50 sm:text-sm dark:text-white/50">
              Unlock your personalized stream and course recommendations with our AI guidance quiz.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-row gap-3">
          <Link
            href="/assessment/class"
            className="group inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-pink-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-400 sm:text-sm"
          >
            Start Free Quiz
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

