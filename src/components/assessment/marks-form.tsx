"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { marksSchema, type SubjectMarks } from "@/validations/assessment";

const defaultSubjects = {
  "10": ["English", "Mathematics", "Science", "Social Science", "Hindi"],
  "12": ["English", "Physics", "Chemistry", "Mathematics","Biology"],
};

export default function MarksForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const classLevel = searchParams.get("class");

  const [subjects, setSubjects] = useState<SubjectMarks[]>(() => {
    if (classLevel !== "10" && classLevel !== "12") {
      return [];
    }

    return defaultSubjects[classLevel].map((subject) => ({
      subject,
      marks: 0,
    }));
  });

  function updateSubject(index: number, value: string) {
    setSubjects((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              subject: value,
            }
          : item,
      ),
    );
  }

  function updateMarks(index: number, value: string) {
    const marks = value === "" ? 0 : Number(value);

    setSubjects((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              marks,
            }
          : item,
      ),
    );
  }

  function addSubject() {
    setSubjects((current) => [
      ...current,
      {
        subject: "",
        marks: 0,
      },
    ]);
  }

  function removeSubject(index: number) {
    setSubjects((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function handleContinue() {
    if (classLevel !== "10" && classLevel !== "12") {
      toast.error("Please select your class first.");
      router.push("/assessment/class");
      return;
    }

    const parsed = marksSchema.safeParse({
      classLevel,
      subjects,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid marks.");
      return;
    }

    const hasInvalidMarks = subjects.some(
      (item) => item.marks < 0 || item.marks > 100,
    );

    if (hasInvalidMarks) {
      toast.error("Marks must be between 0 and 100.");
      return;
    }

    const encodedData = encodeURIComponent(
      JSON.stringify(parsed.data.subjects),
    );

    router.push(`/assessment/quiz?class=${classLevel}&marks=${encodedData}`);
  }

  if (classLevel !== "10" && classLevel !== "12") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Class selection is required</h1>

          <button
            type="button"
            onClick={() => router.push("/assessment/class")}
            className="mt-5 border border-black bg-black px-6 py-3 font-medium text-white dark:border-white dark:bg-white dark:text-black"
          >
            Select Class
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-12">
      <div className="mb-10">
        <p className="text-md w-fit font-semibold text-yellow-500 py-1 px-2 bg-amber-400/40 border-2 rounded-full border-yellow-500/25">
          Class {classLevel}
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Enter Your Marks
        </h1>

        <p className="mt-3 font-semibold text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Enter your subject-wise marks out of 100. You can also add extra subjects if
          needed.
        </p>
      </div>

      <div className="space-y-4">
        {subjects.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 border-2 rounded-lg border-black/10 p-4 dark:border-white/10 sm:grid-cols-[1fr_140px_auto] bg-white dark:bg-black"
          >
            <div>
              <label
                htmlFor={`subject-${index}`}
                className="mb-2 block text-sm font-semibold"
              >
                Subject
              </label>

              <input
                id={`subject-${index}`}
                type="text"
                value={item.subject}
                onChange={(event) => updateSubject(index, event.target.value)}
                placeholder="Subject name"
                className="w-full border rounded-lg border-black/10 bg-transparent px-4 py-3 focus:border-purple-500/50 dark:border-white/10 dark:focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor={`marks-${index}`}
                className="mb-2 block text-sm font-semibold"
              >
                Marks
              </label>

              <input
                id={`marks-${index}`}
                type="number"
                min={0}
                max={100}
                value={item.marks}
                onChange={(event) => updateMarks(index, event.target.value)}
                className="w-full border rounded-lg border-black/10 bg-transparent px-4 py-3 focus:border-purple-500/50 dark:border-white/10 dark:focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeSubject(index)}
                disabled={subjects.length <= 1}
                aria-label={`Remove ${item.subject || "subject"}`}
                className="inline-flex rounded-lg hover:text-red-300 h-12.5 w-full items-center justify-center border border-black/10 dark:border-white/20 px-4 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-30  sm:w-12.5"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSubject}
        className="group mt-5 font-semibold inline-flex bg-pink-500/25 text-pink-500 items-center gap-2 border-2 rounded-2xl border-pink-500/25 px-5 py-3 text-sm transition hover:border-pink-500 active:scale-95 duration-200"
      >
        <Plus className="h-4 w-4 group-hover:transition-transform group-hover:rotate-45 duration-300" />
        Add Subject
      </button>

      <button
        type="button"
        onClick={handleContinue}
        className="mt-8 w-full border rounded-lg border-black bg-black px-6 py-3 font-medium text-white transition hover:opacity-90 dark:border-white dark:bg-white dark:text-black active:scale-95 duration-200 ease-in-out"
      >
        Continue to Quiz
      </button>
    </div>
  );
}
