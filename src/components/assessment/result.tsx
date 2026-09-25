"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Map,
  School,
  Sparkles,
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
            <Sparkles size={18} />
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

/* =========================
   CLASS 10 RESULT
========================= */

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
      {/* Header */}
      {/* Recommended Stream */}
      <article className="overflow-hidden rounded-2xl border-2 border-pink-500/30 bg-pink-500/10 hover:scale-102 duration-300 ease-in-out">
        {/* Stream Header */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10">
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>

              <div>
                {/* AI Recommended */}
                <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <Sparkles className="h-3 w-3 text-yellow-300" />
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
        AI-generated results based on your responses. For personalized advice, consult a counselor or academic advisor.
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

/* =========================
   CLASS 12 RESULT
========================= */

function Class12Result({
  result,
}: {
  result: Extract<AssessmentResult, { classLevel: "12" }>;
}) {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-5 flex items-center gap-3 flex-row justify-between">
          <h2 className="text-2xl font-bold flex flex-row items-center text-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-500" />
            Recommended Streams
          </h2>
          <p className="w-fit rounded-full border-2 border-yellow-500/25 bg-amber-400/40 px-3 py-1 text-sm font-semibold text-yellow-500">
            Class 12
          </p>
        </div>

        <div className="grid gap-5">
          {result.recommendedCourses.map((course) => (
            <article
              key={course.course}
              className="border-2 border-black/10 p-5 dark:border-white/10 sm:p-7"
            >
              {/* Course Header */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Recommended Course
                  </p>

                  <h3 className="mt-1 text-2xl font-black">{course.course}</h3>
                </div>

                <div className="w-fit border-2 border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500">Match</p>

                  <p className="text-2xl font-black text-emerald-500">
                    {course.matchPercentage}%
                  </p>
                </div>
              </div>

              {/* About Degree */}
              <ResultTextSection
                icon={<BookOpen className="h-5 w-5" />}
                title="About Degree"
                text={course.aboutDegree}
              />

              {/* Jobs */}
              <div className="mt-8">
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-5 w-5" />

                  <h4 className="font-bold">Jobs & Salary</h4>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.jobs.map((job) => (
                    <div
                      key={`${job.role}-${job.salaryINR}`}
                      className="border border-black/10 p-4 dark:border-white/10"
                    >
                      <p className="font-semibold">{job.role}</p>

                      <p className="mt-1 text-sm text-emerald-500">
                        {job.salaryINR}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <ResultListSection
                icon={<BookOpen className="h-5 w-5" />}
                title="Subjects"
                items={course.subjects}
              />

              {/* Roadmap */}
              <ResultListSection
                icon={<Map className="h-5 w-5" />}
                title="Roadmap"
                items={course.roadmap}
                numbered
              />

              {/* Colleges */}
              <ResultListSection
                icon={<School className="h-5 w-5" />}
                title="Top Colleges"
                items={course.topColleges}
              />

              {/* Exams */}
              <ResultListSection
                icon={<Target className="h-5 w-5" />}
                title="Entrance Exams"
                items={course.entranceExams}
              />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* =========================
   REUSABLE UI
========================= */

function ResultListSection({
  icon,
  title,
  items,
  numbered = false,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  numbered?: boolean;
}) {
  return (
    <div className="mt-8 ">
      <div></div>
      <div className="flex items-center gap-3">
        {icon}

        <h4 className="font-bold">{title}</h4>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${item}-${index}`}
            className="flex gap-3 border rounded-xl border-black/10 p-3 text-sm dark:border-white/10"
          >
            <span className="font-semibold text-purple-500">
              {numbered ? `${index + 1}.` : "•"}
            </span>

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultTextSection({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        {icon}

        <h4 className="font-bold">{title}</h4>
      </div>

      <p className="mt-4 border border-black/10 p-4 text-sm leading-relaxed dark:border-white/10">
        {text}
      </p>
    </div>
  );
}
