"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  History,
  Scale,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { Assessment, AssessmentResult } from "@/types/assessment";

import { assessmentResultSchema } from "@/validations/assessment-result";

type DashboardProps = {
  userName: string;
  assessments: Assessment[];
};

export default function Dashboard({ userName, assessments }: DashboardProps) {
  const router = useRouter();

  function getResult(aiResult: unknown): AssessmentResult | null {
    const parsed = assessmentResultSchema.safeParse(aiResult);

    return parsed.success ? parsed.data : null;
  }

  const class10Assessments = assessments.filter(
    (assessment) => assessment.class === 10,
  );

  const class12Assessments = assessments.filter(
    (assessment) => assessment.class === 12,
  );

  const matchPercentages = assessments.flatMap((assessment) => {
    const result = getResult(assessment.aiResult);

    if (!result) return [];

    if (result.classLevel === "10") {
      return result.recommendedStreams.map((stream) => stream.matchPercentage);
    }

    return result.recommendedCourses.map((course) => course.matchPercentage);
  });

  const bestMatch = matchPercentages.length ? Math.max(...matchPercentages) : 0;

  function getRecommendation(assessment: Assessment) {
    const result = getResult(assessment.aiResult);

    if (!result) {
      return "Result unavailable";
    }

    if (result.classLevel === "10") {
      return result.recommendedStreams[0]?.stream ?? "Stream recommendation";
    }

    return result.recommendedCourses[0]?.course ?? "Course recommendation";
  }

  function getBestMatch(assessment: Assessment) {
    const result = getResult(assessment.aiResult);

    if (!result) {
      return null;
    }

    if (result.classLevel === "10") {
      const percentages = result.recommendedStreams.map(
        (stream) => stream.matchPercentage,
      );

      return percentages.length ? Math.max(...percentages) : null;
    }

    const percentages = result.recommendedCourses.map(
      (course) => course.matchPercentage,
    );

    return percentages.length ? Math.max(...percentages) : null;
  }

  function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 py-8 sm:py-10">
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center bg-linear-to-br from-purple-600 to-purple-500 p-4 rounded-xl">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />

            <span className="text-sm font-semibold text-emerald-400">
              AI Career Guidance
            </span>
          </div>

          <h1 className="text-3xl text-white font-black tracking-tight sm:text-4xl">
            Welcome back, {userName}
          </h1>

          <p className="mt-2 text-sm text-gray-300">
            Continue exploring your career journey with Eduvora.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/assessment/class")}
          className="flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-black hover:scale-102 duration-300 ease-in-out"
        >
          <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          New Assessment
        </button>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<History className="h-5 w-5 text-pink-400" />}
          title="Total Assessments"
          value={assessments.length}
          description="Completed"
        />

        <StatCard
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          title="Class 10"
          value={class10Assessments.length}
          description="Assessments"
        />

        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-emerald-400" />}
          title="Class 12"
          value={class12Assessments.length}
          description="Assessments"
        />

        <StatCard
          icon={<Trophy className="h-5 w-5 text-yellow-500" />}
          title="Best Match"
          value={`${bestMatch}%`}
          description="AI Match"
        />
      </section>

      {/* Assessment History */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500 animate-pulse " />

              <h2 className="text-xl font-bold">Assessment History</h2>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your completed career assessments
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/courses/compare")}
            className="flex flex-row items-center gap-2 w-fit px-2 py-1 border rounded-xl border-emerald-500 text-emerald-500 bg-emerald-500/25 hover:scale-103 duration-300 ease-in-out active:scale-100"
          >
            <Scale className="h-5 w-5 text-yellow-500" />Compare Courses
          </button>
        </div>

        {assessments.length === 0 ? (
          <div className="rounded-2xl border border-black/10 p-8 text-center dark:border-white/10">
            <GraduationCap className="mx-auto h-10 w-10 text-purple-500" />

            <h3 className="mt-4 text-lg font-bold">No assessments yet</h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Take your first assessment to discover suitable career options.
            </p>

            <button
              type="button"
              onClick={() => router.push("/assessment/class")}
              className="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Start Assessment
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {assessments.map((assessment) => {
              const bestAssessmentMatch = getBestMatch(assessment);

              return (
                <article
                  key={assessment.id}
                  className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:border-purple-500/30 hover:shadow-lg dark:border-white/10 dark:bg-white/5 sm:p-6 hover:scale-102 duration-300 ease-in-out"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                        {assessment.class === 10 ? (
                          <BookOpen className="h-5 w-5 text-purple-500" />
                        ) : (
                          <GraduationCap className="h-5 w-5 text-purple-500" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">
                            Class {assessment.class} Assessment
                          </h3>

                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                            Completed
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-semibold text-purple-500">
                          {getRecommendation(assessment)}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {formatDate(assessment.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Best Match
                        </p>

                        <p className="text-2xl font-black text-purple-500">
                          {bestAssessmentMatch !== null
                            ? `${bestAssessmentMatch}%`
                            : "—"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/assessment/result?id=${assessment.id}`)
                        }
                        className="group flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:border-purple-500 hover:text-purple-500 dark:border-white/10"
                      >
                        View Result
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5 hover:scale-103 duration-300 ease-in-out ">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
          {icon}
        </div>

        <span className="text-xs font-medium text-gray-400">Eduvora</span>
      </div>

      <p className="mt-5 text-3xl font-black">{value}</p>

      <p className="mt-1 text-sm font-semibold">{title}</p>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </article>
  );
}
