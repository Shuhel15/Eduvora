"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  School,
  Sparkles,
  Star,
  Target,
  Trophy,
} from "lucide-react";

import type { AssessmentResult } from "@/validations/assessment-result";

type AssessmentResponse = {
  id: string;
  class: number;
  status: string;
  aiResult: AssessmentResult | null;
  marks: {
    id: string;
    subject: string;
    marksObtained: number;
    maxMarks: number;
  }[];
  quizAnswers: {
    id: string;
    questionId: string;
    answer: string;
  }[];
};

export default function ResultContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id");

  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

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

  return (
    <ResultLoader
      assessmentId={assessmentId}
      assessment={assessment}
      setAssessment={setAssessment}
      error={error}
      setError={setError}
    />
  );
}

type ResultLoaderProps = {
  assessmentId: string;
  assessment: AssessmentResponse | null;
  setAssessment: React.Dispatch<
    React.SetStateAction<AssessmentResponse | null>
  >;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

function ResultLoader({
  assessmentId,
  assessment,
  setAssessment,
  error,
  setError,
}: ResultLoaderProps) {
  useEffect(() => {
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
  }, [assessmentId, setAssessment, setError]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Result not found</h1>

          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </main>
    );
  }

  if (!assessment) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your assessment result...</p>
      </main>
    );
  }

  if (!assessment.aiResult) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Result not available</h1>

          <p className="mt-2 text-gray-500">AI result could not be found.</p>
        </div>
      </main>
    );
  }

  const result = assessment.aiResult;

  return (
    <main className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 ">
        {/* Header */}
        <div className="mb-10 flex items-center flex-col gap-3 text-center">
          <p className=" text-sm font-semibold flex flex-row items-center gap-2 rounded-full px-2 py-1 text-emerald-500 bg-emerald-500/25 border-2 border-emerald-500">
            <Sparkles size={18} className="text-yellow-500 fill-yellow-500" />
            AI Analysis Complete
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Your Career Assessment Result
          </h1>

          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            Based on your marks and assessment responses , AI recommends
          </p>
        </div>

        {result.classLevel === "10" ? (
          <Class10Result result={result} />
        ) : (
          <Class12Result result={result} />
        )}
      </div>
    </main>
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
    <div className="mx-auto w-full max-w-6xl space-y-8">
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
      <p className="mt-3 text-sm  text-gray-300 dark:text-gray-600 text-center">
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
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof result.recommendedCourses)[number] | null
  >(null);

  // COURSE DETAIL VIEW

  if (selectedCourse) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-7">
        {/* Back */}
        <button
          type="button"
          onClick={() => setSelectedCourse(null)}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-5 py-2.5 text-sm font-semibold transition hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </button>

        {/* Course Header */}
        <section className="rounded-3xl border border-purple-500/30 bg-purple-500/5 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              {/* Category */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                <GraduationCap className="h-3.5 w-3.5" />
                Recommended Course
              </div>

              <h2 className="text-2xl font-black leading-tight sm:text-4xl">
                {selectedCourse.course}
              </h2>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock3 className="h-4 w-4" />
                Degree / Course
              </div>
            </div>

            {/* Match */}
            <div className="shrink-0 text-left sm:text-right">
              <p className="bg-linear-to-br from-blue-500 to-purple-400 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                {selectedCourse.matchPercentage}%
              </p>

              <p className="text-xs font-semibold text-gray-500">AI Match</p>
            </div>
          </div>

          {/* About */}
          <div className="mt-6 rounded-2xl bg-black/5 p-5 dark:bg-white/5">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-400" />

              <h3 className="text-sm font-bold">About this degree</h3>
            </div>

            <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
              {selectedCourse.aboutDegree}
            </p>
          </div>
        </section>

        {/* Jobs & Salary */}
        <ResultCard
          icon={<BriefcaseBusiness className="h-4 w-4" />}
          title="Jobs & Salary"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedCourse.jobs.map((job, index) => (
              <div
                key={`${job.role}-${index}`}
                className="rounded-xl border border-black/10 bg-black/2 p-4 dark:border-white/10 dark:bg-white/2"
              >
                <p className="font-semibold">{job.role}</p>

                <p className="mt-1 text-sm font-medium text-emerald-500">
                  {job.salaryINR}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>

        {/* Subjects + Entrance Exams */}
        <div className="grid gap-4 md:grid-cols-2">
          <ResultCard icon={<BookOpen className="h-4 w-4" />} title="Subjects">
            <div className="flex flex-wrap gap-2">
              {selectedCourse.subjects.map((subject, index) => (
                <span
                  key={`${subject}-${index}`}
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300"
                >
                  {subject}
                </span>
              ))}
            </div>
          </ResultCard>

          <ResultCard
            icon={<Target className="h-4 w-4" />}
            title="Entrance Exams"
          >
            <ul className="space-y-3">
              {selectedCourse.entranceExams.map((exam, index) => (
                <li
                  key={`${exam}-${index}`}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="mt-0.5 text-purple-400">✓</span>

                  <span>{exam}</span>
                </li>
              ))}
            </ul>
          </ResultCard>
        </div>

        {/* Roadmap */}
        <ResultCard icon={<Map className="h-4 w-4" />} title="Career Roadmap">
          <ol className="space-y-4">
            {selectedCourse.roadmap.map((step, index) => (
              <li key={`${step}-${index}`} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-bold text-purple-400">
                  {index + 1}
                </span>

                <span className="pt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </ResultCard>

        {/* Colleges */}
        <ResultCard icon={<School className="h-4 w-4" />} title="Top Colleges">
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedCourse.topColleges.map((college, index) => (
              <div
                key={`${college}-${index}`}
                className="rounded-xl border border-black/10 p-4 dark:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-500">
                    {index + 1}
                  </span>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {college}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      </div>
    );
  }

  // COURSE LIST VIEW

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
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
                group w-full rounded-2xl border p-5 text-left transition-all duration-300 hover:scale-102  ease-in-out sm:p-6
                ${
                  isTopPick
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
                    <p className="text-3xl font-black text-blue-400 sm:text-4xl">
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
    </div>
  );
}
