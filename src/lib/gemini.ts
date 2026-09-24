import { GoogleGenAI } from "@google/genai";
import { assessmentResultSchema } from "@/validations/assessment-result";
import type { AssessmentInput } from "@/types/assessment";
import { buildAssessmentPrompt } from "@/lib/prompts/assessment";

const apiKey1 = process.env.GEMINI_API_KEY_1;
const apiKey2 = process.env.GEMINI_API_KEY_2;

if (!apiKey1 || !apiKey2) {
  throw new Error("Gemini API keys are missing.");
}

export const geminiClients = [
  new GoogleGenAI({
    apiKey: apiKey1,
  }),
  new GoogleGenAI({
    apiKey: apiKey2,
  }),
];

let currentClient = 0;

export async function generateCareerResult(input: AssessmentInput) {
  const prompt = buildAssessmentPrompt(input);

  for (let attempt = 0; attempt < geminiClients.length; attempt++) {
    const clientIndex = (currentClient + attempt) % geminiClients.length;

    try {
      const response = await geminiClients[clientIndex].models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const parsed = JSON.parse(text);

      const validated = assessmentResultSchema.safeParse(parsed);

      if (!validated.success) {
        console.error("Gemini validation errors:", validated.error.flatten());

        console.error("Gemini raw response:", text);

        throw new Error("Gemini response failed validation.");
      }

      currentClient = (clientIndex + 1) % geminiClients.length;

      return validated.data;
    } catch (error) {
      console.error(`Gemini API ${clientIndex + 1} failed:`, error);
    }
  }

  throw new Error("All Gemini API keys failed. Please try again.");
}
