import { auth } from "@/auth";

import { NextResponse } from "next/server";

import { generateCareerResult } from "@/lib/gemini";

import { assessmentDataSchema } from "@/validations/assessment-data";

export async function POST(request: Request) {
  try {
    // Authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    //Read request body
    const body = await request.json();

    // Validate assessment data
    const parsed = assessmentDataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment data.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Generate + validate Gemini result
    const result = await generateCareerResult({
      classLevel: parsed.data.classLevel,
      marks: parsed.data.marks,
      quizAnswers: parsed.data.quizAnswers,
    });

    // Return validated result
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Generate assessment result error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate assessment result.",
      },
      { status: 500 },
    );
  }
}