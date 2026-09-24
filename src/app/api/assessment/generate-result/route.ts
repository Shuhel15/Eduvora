import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { generateCareerResult } from "@/lib/gemini";
import { assessmentDataSchema } from "@/validations/assessment-data";

export async function POST(request: Request) {
  try {
    // Authentication
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

    // Read request body
    const body = await request.json();

    console.log("ASSESSMENT API BODY:", body);

    // Validate assessment data
    const parsed = assessmentDataSchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        "ASSESSMENT DATA VALIDATION ERROR:",
        parsed.error.flatten(),
      );

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

    // Generate Gemini result
    const result = await generateCareerResult(parsed.data);

    console.log("GEMINI RESULT GENERATED");

    //  Return result
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    
    console.error("GENERATE ASSESSMENT RESULT ERROR:");
    console.error(error);

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