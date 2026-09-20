import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";

const resendOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = resendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const normalizedEmail = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already verified",
        },
        { status: 400 },
      );
    }

    const otp = await createOtp(normalizedEmail);
    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json(
      {
        success: true,
        message: "OTP resent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in resend OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
