import { z } from "zod";

const assessmentQuizAnswerSchema = z.object({
  questionId: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const assessmentDataSchema = z.object({
  classLevel: z.enum(["10", "12"]),

  marks: z
    .array(
      z.object({
        subject: z.string().trim().min(1),
        marks: z.number().min(0).max(100),
      }),
    )
    .min(1),

  quizAnswers: z
    .array(assessmentQuizAnswerSchema)
    .min(1),
});

export type AssessmentData = z.infer<
  typeof assessmentDataSchema
>;