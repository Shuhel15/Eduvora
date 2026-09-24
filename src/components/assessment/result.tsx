"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import type { AssessmentData } from "@/types/assessment";

export default function ResultContent() {
  const router = useRouter();

  const [assessmentData, setAssessmentData] =
    useState<AssessmentData | null>(null);

  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    const loadAssessmentData = () => {
      const savedData = sessionStorage.getItem(
        "eduvora-assessment-data",
      );

      if (!savedData) {
        setHasCheckedStorage(true);
        return;
      }

      try {
        const parsedData: AssessmentData = JSON.parse(savedData);

        setAssessmentData(parsedData);
      } catch {
        sessionStorage.removeItem("eduvora-assessment-data");

        toast.error("Invalid assessment data.");
      }

      setHasCheckedStorage(true);
    };

    const timeoutId = window.setTimeout(loadAssessmentData, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!hasCheckedStorage) {
    return (
      <main className="min-h-screen py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-500">
            Loading assessment...
          </p>
        </div>
      </main>
    );
  }

  if (!assessmentData) {
    return (
      <main className="min-h-screen py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">
            Assessment data not found
          </h1>

          <p className="mt-2 text-gray-500">
            Please complete the assessment again.
          </p>

          <button
            type="button"
            onClick={() => router.push("/assessment/class")}
            className="mt-6 border rounded-lg border-black bg-black px-6 py-3 font-medium text-white transition hover:opacity-90 dark:border-white dark:bg-white dark:text-black"
          >
            Start Assessment
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          Assessment Submitted
        </h1>

        <p className="mt-2 text-gray-500">
          Assessment completed successfully.
        </p>

        <div className="mt-10 border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-sm">
            Assessment data successfully received.
            Gemini integration will be added in Phase 5.
          </p>
        </div>
      </div>
    </main>
  );
}