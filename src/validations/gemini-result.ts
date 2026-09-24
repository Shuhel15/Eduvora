import { z } from "zod";

//Class 10th Schema
export const class10StreamSchema = z.object({
  stream: z.string().min(1),

  matchPercentage: z
    .number()
    .min(0)
    .max(100),

  whyRecommended: z.string().min(1),

  opportunities: z
    .array(z.string().min(1))
    .min(1),

  subjects: z
    .array(z.string().min(1))
    .min(1),

  coursesAfter12th: z
    .array(z.string().min(1))
    .min(1),

  strengths: z
    .array(z.string().min(1))
    .min(1),

  tips: z
    .array(z.string().min(1))
    .min(1),

  motivation: z.string().min(1),
});

export const class10ResultSchema = z.object({
  classLevel: z.literal("10"),

  recommendedStreams: z
    .array(class10StreamSchema)
    .min(1),
});

//Class 12th Schema

export const class12JobSchema = z.object({
  title: z.string().min(1),

  salaryINR: z.string().min(1),
});

export const class12CourseSchema = z.object({
  course: z.string().min(1),

  matchPercentage: z
    .number()
    .min(0)
    .max(100),

  aboutDegree: z.string().min(1),

  jobs: z
    .array(class12JobSchema)
    .min(1),

  subjects: z
    .array(z.string().min(1))
    .min(1),

  roadmap: z
    .array(z.string().min(1))
    .min(1),

  topColleges: z
    .array(z.string().min(1))
    .min(1),

  entranceExams: z
    .array(z.string().min(1))
    .min(1),
});

export const class12ResultSchema = z.object({
  classLevel: z.literal("12"),

  recommendedCourses: z
    .array(class12CourseSchema)
    .min(1),
});

//Combined Result Schema for Class 10 and Class 12
export const geminiResultSchema = z.discriminatedUnion(
  "classLevel",
  [
    class10ResultSchema,
    class12ResultSchema,
  ],
);

export type Class10Result = z.infer<
  typeof class10ResultSchema
>;

export type Class12Result = z.infer<
  typeof class12ResultSchema
>;

export type GeminiResult = z.infer<
  typeof geminiResultSchema
>;