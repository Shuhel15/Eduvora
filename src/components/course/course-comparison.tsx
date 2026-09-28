"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Map,
  School,
  Target,
  Trophy,
  X,
} from "lucide-react";

import type { AssessmentResult } from "@/validations/assessment-result";

type Class12Course = Extract<
  AssessmentResult,
  { classLevel: "12" }
>["recommendedCourses"][number];

type CourseComparisonProps = {
  courses: Class12Course[];
};

export default function CourseComparison({
  courses,
}: CourseComparisonProps) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const toggleCourse = (courseName: string) => {
    setSelectedCourses((previous) => {
      if (previous.includes(courseName)) {
        return previous.filter((course) => course !== courseName);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, courseName];
    });
  };

  const selected = useMemo(
    () =>
      courses.filter((course) =>
        selectedCourses.includes(course.course),
      ),
    [courses, selectedCourses],
  );

  if (!courses.length) {
    return (
      <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-purple-500" />
          <div>
            <h2 className="text-lg font-bold">
              No courses available
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Complete a Class 12 assessment first.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-purple-500" />
              <h1 className="text-2xl font-black sm:text-3xl">
                Compare Courses
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Select up to 3 AI-recommended courses to compare.
            </p>
          </div>

          <div className="w-fit rounded-full border border-purple-500 bg-purple-500/25 px-3 py-1.5 text-xs font-semibold text-purple-500">
            {selectedCourses.length}/3 Selected
          </div>
        </div>
      </section>

      {/* Course Selection */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isSelected = selectedCourses.includes(course.course);

            return (
              <button
                key={course.course}
                type="button"
                onClick={() => toggleCourse(course.course)}
                className={`text-left transition ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-black/10 bg-transparent hover:border-purple-500/40 dark:border-white/10"
                } rounded-2xl border-2 p-5`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Recommended Course
                    </p>

                    <h2 className="mt-2 text-lg font-black">
                      {course.course}
                    </h2>
                  </div>

                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-gray-400 text-transparent dark:border-gray-600"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      AI Match
                    </p>

                    <p className="text-3xl font-black text-purple-500">
                      {course.matchPercentage}%
                    </p>
                  </div>

                  <span className="text-xs font-medium text-gray-500">
                    {isSelected ? "Selected" : "Select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Comparison */}
      {selected.length >= 2 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                Course Comparison
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Compare the selected courses side by side.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCourses([])}
              className="group flex items-center text-center gap-1.5 text-sm font-semibold text-red-500 p-1.5 border rounded-full bg-red-500/25 hover:scale-103 duration-300 ease-in-out"
            >
              <X className="h-4 w-4 transition-transform group-hover:rotate-45 duration-300" />
              Clear
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
            <div
              className="min-w-225"
              style={{
                display: "grid",
                gridTemplateColumns: `180px repeat(${selected.length}, minmax(240px, 1fr))`,
              }}
            >
              {/* Course names */}
              <ComparisonLabel label="Course" />

              {selected.map((course) => (
                <ComparisonValue key={course.course}>
                  <h3 className="font-black">
                    {course.course}
                  </h3>

                  <p className="mt-2 text-3xl font-black text-purple-500">
                    {course.matchPercentage}%
                  </p>

                  <p className="text-xs text-gray-500">
                    AI Match
                  </p>
                </ComparisonValue>
              ))}

              {/* About */}
              <ComparisonLabel
                icon={<BookOpen className="h-4 w-4" />}
                label="About Degree"
              />

              {selected.map((course) => (
                <ComparisonValue key={`${course.course}-about`}>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {course.aboutDegree}
                  </p>
                </ComparisonValue>
              ))}

              {/* Jobs */}
              <ComparisonLabel
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                label="Jobs & Salary"
              />

              {selected.map((course) => (
                <ComparisonValue key={`${course.course}-jobs`}>
                  <div className="space-y-3">
                    {course.jobs.map((job) => (
                      <div key={`${job.role}-${job.salaryINR}`}>
                        <p className="text-sm font-semibold">
                          {job.role}
                        </p>
                        <p className="mt-1 text-xs font-medium text-emerald-500">
                          {job.salaryINR}
                        </p>
                      </div>
                    ))}
                  </div>
                </ComparisonValue>
              ))}

              {/* Subjects */}
              <ComparisonLabel
                icon={<BookOpen className="h-4 w-4" />}
                label="Subjects"
              />

              {selected.map((course) => (
                <ComparisonValue key={`${course.course}-subjects`}>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-500"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </ComparisonValue>
              ))}

              {/* Roadmap */}
              <ComparisonLabel
                icon={<Map className="h-4 w-4" />}
                label="Roadmap"
              />

              {selected.map((course) => (
                <ComparisonValue key={`${course.course}-roadmap`}>
                  <ol className="space-y-3">
                    {course.roadmap.map((step, index) => (
                      <li
                        key={`${step}-${index}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-500">
                          {index + 1}
                        </span>

                        <span className="text-gray-600 dark:text-gray-300">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </ComparisonValue>
              ))}

              {/* Colleges */}
              <ComparisonLabel
                icon={<School className="h-4 w-4" />}
                label="Top Colleges"
              />

              {selected.map((course) => (
                <ComparisonValue key={`${course.course}-colleges`}>
                  <ul className="space-y-2">
                    {course.topColleges.map((college) => (
                      <li
                        key={college}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1 text-purple-500">
                          •
                        </span>

                        <span className="text-gray-600 dark:text-gray-300">
                          {college}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ComparisonValue>
              ))}

              {/* Exams */}
              <ComparisonLabel
                icon={<Target className="h-4 w-4" />}
                label="Entrance Exams"
              />

              {selected.map((course) => (
                <ComparisonValue key={`${course.course}-exams`}>
                  <div className="flex flex-wrap gap-2">
                    {course.entranceExams.map((exam) => (
                      <span
                        key={exam}
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                </ComparisonValue>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Minimum Selection Message */}
      {selected.length < 2 && (
        <section className="rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 p-6 text-center">
          <Trophy className="mx-auto h-7 w-7 text-purple-500" />

          <h2 className="mt-3 font-bold">
            Select at least 2 courses
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Choose two or three courses above to start comparing.
          </p>
        </section>
      )}
    </div>
  );
}

function ComparisonLabel({
  icon,
  label,
}: {
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <div className="border-b border-r border-black/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm font-bold">
        {icon && (
          <span className="text-purple-500">
            {icon}
          </span>
        )}

        {label}
      </div>
    </div>
  );
}

function ComparisonValue({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 p-5 dark:border-white/10">
      {children}
    </div>
  );
}