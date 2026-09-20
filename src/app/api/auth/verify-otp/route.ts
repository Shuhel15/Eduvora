import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getOtp, deleteOtp } from "@/lib/otp";

const verifyOtpSchem = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchem.safeParse(body);

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

    const { email, otp } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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

    const storedOtp = await getOtp(normalizedEmail);

    if (!storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your OTP is invalid or has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP.",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { emailVerified: new Date() },
    });

    await deleteOtp(normalizedEmail);

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while verifying the OTP.",
      },
      { status: 500 },
    );
  }
}
