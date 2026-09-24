"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { assessmentSchema } from "@/validations/assessment";

import { class10Quiz } from "@/data/quiz/class10";
import { class12Quiz } from "@/data/quiz/class12";
import type { QuizQuestions } from "@/types/quiz";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const classLevel = searchParams.get("class");

  const questions: QuizQuestions[] = useMemo(() => {
    if (classLevel === "10") {
      return class10Quiz;
    }

    if (classLevel === "12") {
      return class12Quiz;
    }

    return [];
  }, [classLevel]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (classLevel !== "10" && classLevel !== "12") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid assessment</h1>

          <button
            type="button"
            onClick={() => router.push("/assessment/class")}
            className="mt-5 border rounded-xl border-black bg-black px-6 py-3 font-medium text-foreground dark:border-white dark:bg-white "
          >
            Start Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (!question) {
    return null;
  }

  const selectedAnswer = answers[question.id];

  const isLastQuestion = currentQuestion === questions.length - 1;

  function handleAnswer(option: string) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: option,
    }));
  }

  function handlePrevious() {
    if (currentQuestion === 0) return;

    setCurrentQuestion((previous) => previous - 1);
  }

  function handleNext() {
    if (!selectedAnswer) {
      toast.error("Please select an answer.");
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
  }

function handleSubmit() {
  const unansweredQuestion = questions.find(
    (item) => !answers[item.id],
  );

  if (unansweredQuestion) {
    const unansweredIndex = questions.findIndex(
      (item) => item.id === unansweredQuestion.id,
    );

    setCurrentQuestion(unansweredIndex);

    toast.error("Please answer all questions before submitting.");

    return;
  }

  const savedMarks = sessionStorage.getItem(
    "eduvora-assessment-marks",
  );

  if (!savedMarks) {
    toast.error(
      "Marks data not found. Please enter your marks again.",
    );

    router.push(`/assessment/marks?class=${classLevel}`);

    return;
  }

  let marksData: {
    classLevel: string;
    subjects: {
      subject: string;
      marks: number;
    }[];
  };

  try {
    marksData = JSON.parse(savedMarks);
  } catch {
    toast.error(
      "Invalid marks data. Please enter your marks again.",
    );

    sessionStorage.removeItem("eduvora-assessment-marks");

    router.push(`/assessment/marks?class=${classLevel}`);

    return;
  }

  const quizAnswers = questions.map((question) => ({
    questionId: question.id,
    question: question.question,
    answer: answers[question.id],
  }));

  const parsedAssessment = assessmentSchema.safeParse({
    classLevel,
    marks: marksData.subjects,
    quizAnswers,
  });

  if (!parsedAssessment.success) {
    toast.error(
      parsedAssessment.error.issues[0]?.message ||
        "Invalid assessment data.",
    );

    return;
  }

  sessionStorage.setItem(
    "eduvora-assessment-data",
    JSON.stringify(parsedAssessment.data),
  );

  toast.success("Quiz completed!");

  router.push(`/assessment/result?class=${classLevel}`);
}

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl py-12">
      <div className="mb-8">
        <p className="text-sm text-yellow-500 font-semibold border-2 rounded-full w-fit border-yellow-500 bg-yellow-500/25 px-2 py-1">
          Class {classLevel}
        </p>

        <div className="mt-2 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Career Assessment
          </h1>

          <span className="shrink-0 text-sm font-semibold">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-5 h-2 w-full overflow-hidden bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300 "
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="border rounded-xl border-black/10 p-5 dark:border-white/10 sm:p-8">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Question {currentQuestion + 1}
        </p>

        <h2 className="mt-3 text-xl font-bold leading-relaxed sm:text-2xl">
          {question.question}
        </h2>

        {/* Options */}
        <div className="mt-7 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                className={`group flex w-full items-center gap-4 border rounded-xl p-4 text-left transition active:scale-97 ease-in-out duration-300 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/25 text-foreground "
                    : "hover:border-emerald-500 border-black/10 dark:border-white/10 "
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center border rounded-full text-sm font-medium group-hover:border-emerald-500 ${
                    isSelected
                      ? "border-emerald-500 text-foreground"
                      : "border-black/10 dark:border-white/10 "
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="flex-1">{option}</span>

                {isSelected && <Check className="h-5 w-5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="group inline-flex font-semibold items-center text-red-500 gap-2 border-2 rounded-xl border-red-300 hover:border-red-500  bg-red-500/25  px-5 py-3  transition  disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 ease-in-out duration-300"
        >
          <ArrowLeft className="h-4 w-4 group-hover:transition-transform group-hover:-translate-x-1 duration-300" />
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="group inline-flex items-center gap-2 border-2  px-5 py-3 font-medium  transition border-purple-300 hover:border-purple-500 bg-purple-500/25 text-purple-500 rounded-xl active:scale-95 ease-in-out duration-300"
        >
          {isLastQuestion ? "Submit Assessment" : "Next"}

          {!isLastQuestion && (
            <ArrowRight className="h-4 w-4 group-hover:transition-transform group-hover:translate-x-1 duration-300 " />
          )}
        </button>
      </div>
    </div>
  );
}

export default function QuizForm() {
  return (
    <Suspense fallback={null}>
      <QuizContent />
    </Suspense>
  );
}
