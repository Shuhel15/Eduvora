import type { AssessmentInput } from "@/types/assessment";

export function buildAssessmentPrompt(
  input: AssessmentInput,
): string {
  const marks = input.marks
    .map((item) => `${item.subject}:${item.marks}`)
    .join(",");

  const quiz = input.quizAnswers
    .map((item) => `${item.question}=${item.answer}`)
    .join("\n");

  if (input.classLevel === "10") {
    return `
You are a career guidance AI for Indian Class 10 students.

Class: 10
Marks: ${marks}

Quiz:
${quiz}

Return ONLY JSON.

Required JSON:
{
  "classLevel": "10",
  "recommendedStreams": [
    {
      "stream": "string",
      "matchPercentage": 0,
      "whyRecommended": ["string"],
      "opportunities": ["string"],
      "subjects": ["string"],
      "coursesAfter12th": ["string"],
      "strengths": ["string"],
      "tips": ["string"]
    }
  ],
  "motivation": "string"
}

Rules:
- Recommend 2 to 3 suitable streams.
- matchPercentage must be 0-100.
- All arrays must contain at least 1 item.
- Keep text short.
- Use Indian education context.
- Do not add extra fields.
`;
  }

  return `
You are a career guidance AI for Indian Class 12 students.

Class: 12
Marks: ${marks}

Quiz:
${quiz}

Return ONLY JSON.

Required JSON:
{
  "classLevel": "12",
  "recommendedCourses": [
    {
      "course": "string",
      "matchPercentage": 0,
      "aboutDegree": "string",
      "jobs": [
        {
          "role": "string",
          "salaryINR": "string"
        }
      ],
      "subjects": ["string"],
      "roadmap": ["string"],
      "topColleges": ["string"],
      "entranceExams": ["string"]
    }
  ]
}

Rules:
- Recommend 2 to 3 suitable courses.
- matchPercentage must be 0-100.
- All arrays must contain at least 1 item.
- Keep text short.
- Use Indian education context.
- salaryINR should be a concise INR range.
- Do not add extra fields.
`;
}