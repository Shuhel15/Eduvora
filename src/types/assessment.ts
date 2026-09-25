import type { AssessmentResult } from "@/validations/assessment-result";

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

export type AssessmentResponse = {
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