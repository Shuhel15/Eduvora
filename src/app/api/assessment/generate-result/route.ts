import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import { generateCareerResult } from "@/lib/gemini";
import { assessmentDataSchema } from "@/validations/assessment-data";

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await auth();

    console.log("ASSESSMENT API SESSION:", session);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Read request body
    const body = await request.json();

    console.log("ASSESSMENT API BODY:", body);

    // 3. Validate assessment data
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

    console.log("ASSESSMENT DATA VALIDATED");

    // 4. Generate Gemini result
    const result = await generateCareerResult(parsed.data);

    console.log("GEMINI RESULT GENERATED");

    // 5. Save complete assessment in PostgreSQL
    const assessment = await prisma.assessment.create({
      data: {
        class: Number(parsed.data.classLevel),
        status: "COMPLETED",
        userId: session.user.id,

        marks: {
          create: parsed.data.marks.map((item) => ({
            subject: item.subject,
            marksObtained: item.marks,
            maxMarks: 100,
          })),
        },

        quizAnswers: {
          create: parsed.data.quizAnswers.map((item) => ({
            questionId: item.questionId,
            answer: item.answer,
          })),
        },

        aiResult: result,
      },
    });

    console.log("ASSESSMENT SAVED:", assessment.id);

    // 6. Return result
    return NextResponse.json({
      success: true,
      result,
      assessmentId: assessment.id,
    });
  } catch (error) {
    console.error("Generate assessment result error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate assessment result.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}