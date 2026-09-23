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