import { z } from "zod";

export const subjectMarksSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject name is required"),

  marks: z
    .number()
    .min(0, "Marks cannot be negative")
    .max(100, "Marks cannot exceed 100"),
});

export const marksSchema = z.object({
  classLevel: z.enum(["10", "12"]),

  subjects: z
    .array(subjectMarksSchema)
    .min(1, "At least one subject is required"),
});

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),

  question: z.string().min(1, "Question is required"),

  answer: z.string().min(1, "Answer is required"),
});

export const assessmentSchema = z.object({
  classLevel: z.enum(["10", "12"]),

  marks: z
    .array(subjectMarksSchema)
    .min(1, "At least one subject is required"),

  quizAnswers: z
    .array(quizAnswerSchema)
    .min(1, "At least one quiz answer is required"),
});

export type SubjectMarks = z.infer<typeof subjectMarksSchema>;

export type Marks = z.infer<typeof marksSchema>;

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;

export type AssessmentData = z.infer<typeof assessmentSchema>;