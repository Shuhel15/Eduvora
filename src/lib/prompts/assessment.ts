import type { AssessmentInput } from "@/types/assessment";

export function buildAssessmentPrompt(
  input: AssessmentInput,
): string {
  return `
You are a career guidance AI for Indian students.

Class: ${input.classLevel}

Marks:
${input.marks.map((item) => `${item.subject}: ${item.marks}/100`).join(", ")}

Quiz:
${input.quizAnswers
  .map((item) => `${item.question}: ${item.answer}`)
  .join("\n")}

Return ONLY valid JSON matching the provided response schema.

For Class 10, recommend suitable streams.
For Class 12, recommend suitable courses.

Keep the response concise and practical.
`;
}