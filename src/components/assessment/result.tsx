"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Lightbulb,
  Map,
  MapPin,
  RefreshCcw,
  School,
  Sparkles,
  Star,
  Stars,
  Target,
  Trophy,
} from "lucide-react";
import type { AssessmentResult } from "@/validations/assessment-result";
import type { AssessmentResponse } from "@/types/assessment";
import Loading from "@/app/loading";

export default function ResultContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id");

  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) return;

    let cancelled = false;

    async function loadAssessment() {
      try {
        const response = await fetch(`/api/assessment/${assessmentId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to load assessment.");
        }

        if (!cancelled) {
          setAssessment(data.assessment);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load assessment.",
          );
        }
      }
    }

    loadAssessment();

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Result not found</h1>

          <p className="mt-2 text-gray-500">Assessment ID not found.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Unable to load result</h1>

          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  if (!assessment) {
    return <Loading />;
  }

  const result = assessment.aiResult;

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Result not available</h1>

          <p className="mt-2 text-gray-500">
            Your assessment result is not available yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full">
      {result.classLevel === "10" ? (
        <Class10Result result={result} />
      ) : (
        <Class12Result result={result} />
      )}
    </div>
  );
}

// CLASS 10 RESULT

function Class10Result({
  result,
}: {
  result: Extract<AssessmentResult, { classLevel: "10" }>;
}) {
  const stream = result.recommendedStreams[0];

  if (!stream) {
    return (
      <div className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-gray-500">No stream recommendation found.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Recommended Stream */}
      <article className="overflow-hidden rounded-2xl border-2 border-pink-500/30 bg-pink-500/10 hover:scale-102 duration-300 ease-in-out">
        {/* Stream Header */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10">
                <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-500" />
              </div>

              <div>
                {/* AI Recommended */}
                <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <Sparkles className="h-3 w-3 text-yellow-300 fill-yellow-500" />
                  AI Recommended
                </div>

                <h2 className="text-2xl font-black">{stream.stream}</h2>

                <p className="mt-1 text-sm font-medium text-pink-400">
                  Ideal for creative & socially-aware minds
                </p>
              </div>
            </div>

            {/* Match */}
            <div className="text-left sm:text-right">
              <p className="bg-linear-to-br from-pink-500 to-pink-300 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                {stream.matchPercentage}%
              </p>

              <p className="text-xs font-medium text-gray-500">AI Match</p>
            </div>
          </div>

          {/* Why AI chose this */}
          <div className="mt-5 rounded-xl bg-white p-4 dark:bg-black/30">
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-300">
              <span className="font-bold text-pink-400">
                Why AI chose this:
              </span>{" "}
              {stream.whyRecommended.join(" ")}
            </p>
          </div>
        </div>
      </article>

      {/* Main Information Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Why Choose */}
        <ResultCard
          icon={<CheckCircle2 className="h-4 w-4 text-yellow-500" />}
          title={`Why choose ${stream.stream}?`}
          className="border-yellow-500! bg-yellow-500/25! hover:scale-102 duration-300 ease-in-out"
        >
          <ul className="space-y-3">
            {stream.opportunities.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        {/* Subjects */}
        <ResultCard
          icon={<BookOpen className="h-4 w-4" />}
          title={`Subjects in ${stream.stream}`}
          className="hover:scale-102 duration-300 ease-in-out border-gray-500! bg-gray-500/25!"
        >
          <div className="flex flex-wrap gap-2">
            {stream.subjects.map((subject, index) => (
              <span
                key={`${subject}-${index}`}
                className="rounded-full border border-purple-500 bg-purple-500/25 px-3 py-1.5 text-xs font-medium text-purple-500"
              >
                {subject}
              </span>
            ))}
          </div>
        </ResultCard>

        {/* Courses After 12th */}
        <ResultCard
          icon={<GraduationCap className="h-4 w-4 text-pink-500" />}
          title="After Class 12 you can do"
          className="border-pink-500! bg-pink-500/25! hover:scale-102 duration-300 ease-in-out"
        >
          <ol className="space-y-2.5">
            {stream.coursesAfter12th.map((course, index) => (
              <li
                key={`${course}-${index}`}
                className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center text-center justify-center rounded-full bg-pink-300 text-xs font-bold ">
                  {index + 1}
                </span>

                <span>{course}</span>
              </li>
            ))}
          </ol>
        </ResultCard>

        {/* Strengths */}
        <ResultCard
          icon={<Trophy className="h-4 w-4 text-blue-500" />}
          title="Your Strengths (AI detected)"
          className="border-blue-500! bg-blue-500/25! hover:scale-102 duration-300 ease-in-out"
        >
          <ul className="space-y-3">
            {stream.strengths.map((strength, index) => (
              <li
                key={`${strength}-${index}`}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200 "
              >
                <span className="mt-1 text-blue-500 dark:text-blue-400">✓</span>

                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        {/* Tips */}
        <ResultCard
          icon={<Lightbulb className="h-4 w-4 text-yellow-500" />}
          title="Tips to Succeed"
          className="border-emerald-500! bg-emerald-500/25! md:col-span-2 hover:scale-102 duration-300 ease-in-out"
        >
          <ol className="space-y-3">
            {stream.tips.map((tip, index) => (
              <li
                key={`${tip}-${index}`}
                className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-300"
              >
                <span className="font-bold text-emerald-500">{index + 1}.</span>

                <span>{tip}</span>
              </li>
            ))}
          </ol>
        </ResultCard>
      </div>

      {/* Motivation */}
      <section className="mx-auto max-w-xl rounded-2xl border border-purple-500 bg-purple-500/25 p-6 text-center hover:scale-102 duration-300 ease-in-out">
        <h2 className="text-lg font-bold">You&apos;re on the right track!</h2>

        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-300">
          {result.motivation}
        </p>
      </section>
      <p className="mt-30 text-sm text-gray-300 dark:text-gray-600 text-center">
        AI-generated results based on your responses. For personalized advice,
        consult a counselor or academic advisor.
      </p>
    </div>
  );
}

function ResultCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-black/10 bg-black/2 p-5 dark:border-white/10 dark:bg-white/2 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-purple-400">{icon}</span>

        <h3 className="text-sm font-bold">{title}</h3>
      </div>

      {children}
    </section>
  );
}

// CLASS 12 RESULT

export function Class12Result({
  result,
}: {
  result: Extract<AssessmentResult, { classLevel: "12" }>;
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof result.recommendedCourses)[number] | null
  >(result.recommendedCourses[0] || null);

  type Class12Tab = "jobs" | "subjects" | "roadmap" | "colleges" | "exams";
  const [activeTab, setActiveTab] = useState<Class12Tab>("jobs");

  // COURSE DETAIL VIEW

  if (selectedCourse) {
    const tabs: { id: Class12Tab; label: string }[] = [
      { id: "jobs", label: "Jobs & Salary" },
      { id: "subjects", label: "Subjects" },
      { id: "roadmap", label: "Roadmap" },
      { id: "colleges", label: "Top Colleges" },
      { id: "exams", label: "Entrance Exams" },
    ];

    return (
      <div className="w-full space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setSelectedCourse(null)}
            className="group w-fit inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-sm font-semibold transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 duration-300" />
            Back to courses
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/assessment/class")}
              className="group flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-xs sm:text-sm font-semibold transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <RefreshCcw className="h-4 w-4 transition-transform group-hover:-rotate-180 duration-300" />
              Retake Quiz
            </button>

            <button
              onClick={() => router.push("/colleges/nearby")}
              className="group flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/20 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-500 dark:text-blue-400 transition hover:bg-blue-500/30"
            >
              <MapPin className="h-4 w-4 transition-transform group-hover:-rotate-40 duration-300" />
              Find Colleges
            </button>
          </div>
        </div>

        {/* Course Header Card */}
        <section className="rounded-2xl border border-black/10 bg-black/2 p-6 dark:border-white/10 dark:bg-white/2 sm:rounded-3xl sm:p-7 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/15 px-3.5 py-1 text-xs font-semibold text-purple-500 dark:text-purple-400">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Recommended Course</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-gray-900 dark:text-white">
            {selectedCourse.course}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              <span>4 years</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-500 dark:text-purple-400 font-bold">
              <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{selectedCourse.matchPercentage}% AI Match</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
            {selectedCourse.aboutDegree}
          </p>
        </section>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                  ? "border border-purple-500/50 bg-purple-500/20 text-purple-500 dark:text-white font-semibold shadow-xs"
                  : "border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <section className="rounded-2xl border border-black/10 bg-black/2 p-6 dark:border-white/10 dark:bg-white/2 sm:rounded-3xl sm:p-7">
          {/* Jobs & Salary Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <BriefcaseBusiness className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Jobs after {selectedCourse.course}
                </h3>
              </div>

              <div className="divide-y divide-black/10 dark:divide-white/10">
                {selectedCourse.jobs.map((job, index) => {
                  const demand = index % 3 === 2 ? "Very High" : "High";
                  const formattedSalary = job.salaryINR.startsWith("₹")
                    ? job.salaryINR
                    : `₹${job.salaryINR}`;

                  return (
                    <div
                      key={`${job.role}-${index}`}
                      className="flex items-center justify-between py-4 first:pt-2 last:pb-2"
                    >
                      <div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {job.role}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Average:{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {formattedSalary}
                          </span>
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-1 text-xs font-semibold border ${demand === "Very High"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                          : "border-purple-500/30 bg-purple-500/15 text-purple-500 dark:text-purple-400"
                          }`}
                      >
                        {demand}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === "subjects" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Subjects in {selectedCourse.course}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {selectedCourse.subjects.map((subject, index) => (
                  <span
                    key={`${subject}-${index}`}
                    className="rounded-full border border-yellow-500/30 bg-yellow-500/15 px-4 py-2 text-xs font-semibold text-yellow-500"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap Tab */}
          {activeTab === "roadmap" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Map className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Career Roadmap for {selectedCourse.course}
                </h3>
              </div>

              <ol className="relative space-y-6 pt-2">
                <div className="absolute left-3.5 top-6 bottom-6 w-px bg-purple-500/30" />
                {selectedCourse.roadmap.map((step, index) => (
                  <li
                    key={`${step}-${index}`}
                    className="relative flex items-start gap-4"
                  >
                    <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                        Year {index + 1}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {step}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Top Colleges Tab */}
          {activeTab === "colleges" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <School className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Top Colleges for {selectedCourse.course}
                </h3>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                {selectedCourse.topColleges.map((college, index) => (
                  <div
                    key={`${college}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-500 dark:text-blue-400 border border-blue-500/30">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {college}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entrance Exams Tab */}
          {activeTab === "exams" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Target className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Entrance Exams for {selectedCourse.course}
                </h3>
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                {selectedCourse.entranceExams.map((exam, index) => (
                  <div
                    key={`${exam}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/2 dark:bg-white/2 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/15 text-xs text-pink-500 dark:text-pink-400 font-bold border border-pink-500/30">
                      ✓
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {exam}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <p className="mt-8 text-sm text-gray-400 dark:text-gray-600 text-center">
          AI-generated results based on your responses. For personalized advice,
          consult a counselor or academic advisor.
        </p>
      </div>
    );
  }

  // COURSE LIST VIEW

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <div className="flex flex-col justify-center items-center gap-5 ">
        <p className="text-sm border-2 border-emerald-500/25 bg-emerald-500/25 text-emerald-500 w-fit rounded-full px-3 py-1 text-center flex flex-row gap-1 items-center">
          <Stars size={16} />
          AI Analysis Complete
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-center ">
          Recommended Courses <span className="text-blue-500">for You</span>
        </h1>
        <p className="text-sm text-black/50 dark:text-white/50 text-center">
          Click any course to see jobs, salary, roadmap and colleges
        </p>
      </div>
      {/* Course Cards */}
      <div className="space-y-4">
        {result.recommendedCourses.map((course, index) => {
          const isTopPick = index === 0;

          return (
            <button
              key={course.course}
              type="button"
              onClick={() => setSelectedCourse(course)}
              className={`
                group w-full rounded-2xl border p-5 text-left transition-all duration-300 hover:scale-102 ease-in-out sm:p-6 cursor-pointer
                ${isTopPick
                  ? "border-purple-500 bg-purple-500/25"
                  : "border-black/10 bg-black/2 dark:border-white/10 dark:bg-white/2"
                }
              `}
            >
              <div className="flex items-center justify-between gap-5">
                {/* Left */}
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-500 bg-blue-500/25 px-3 py-1 text-xs font-semibold text-blue-500">
                      Course
                    </span>

                    {isTopPick && (
                      <span className="rounded-full flex flex-row items-center text-center gap-1 border border-emerald-500 bg-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-500">
                        <Star
                          size={15}
                          className="text-yellow-500 fill-yellow-500"
                        />{" "}
                        Top Pick
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      Degree
                    </span>
                  </div>

                  <h3 className="text-xl font-black leading-tight sm:text-2xl">
                    {course.course}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {course.aboutDegree}
                  </p>
                </div>

                {/* Right */}
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p className="text-3xl font-black bg-linear-to-br from-blue-500 to-purple-500 text-transparent bg-clip-text sm:text-4xl">
                      {course.matchPercentage}%
                    </p>

                    <p className="text-xs text-gray-500">AI Match</p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <p className="text-center text-sm text-gray-500 animate-bounce">
        Tap any course to explore jobs, salary, roadmap and colleges
      </p>
      <p className=" text-sm text-gray-300 dark:text-gray-600 text-center">
        AI-generated results based on your responses. For personalized advice,
        consult a counselor or academic advisor.
      </p>
    </div>
  );
}
