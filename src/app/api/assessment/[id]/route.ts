import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    // 1.Authenticate the user
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

    const { id } = await params;

    const assessment = await prisma.assessment.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        marks: true,
        quizAnswers: true,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load assessment",
      },
      { status: 500 },
    );
  }
}
