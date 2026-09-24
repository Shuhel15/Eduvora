export type AssessmentData = {
  classLevel: "10" | "12";
  marks: {
    subject: string;
    marks: number;
  }[];
  quizAnswers: {
    questionId: string;
    question: string;
    answer: string;
  }[];
};

export type ResultPageProps = {
  searchParams: Promise<{
    data?: string;
  }>;
};

import type { AssessmentResult } from "@/validations/assessment-result";

export interface AssessmentInput {
  classLevel: "10" | "12";
  marks: {
    subject: string;
    marks: number;
  }[];
  quizAnswers: {
    questionId: string;
    question: string;
    answer: string;
  }[];
}

export type { AssessmentResult };