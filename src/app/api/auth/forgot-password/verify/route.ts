import { NextResponse } from "next/server";
import { z } from "zod";

import redis from "@/lib/redis";

const verifyOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or OTP",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email.toLowerCase();
    const { otp } = parsed.data;

    const otpKey = `forgot-password:otp:${normalizedEmail}`;

    const storedOtp = await redis.get(otpKey);

    if (!storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP. Please try again.",
        },
        { status: 400 }
      );
    }

    await redis.del(otpKey);
    await redis.set(
      `forgot-password:verified:${normalizedEmail}`,
      "true",
      "EX",
      60 * 10
    );

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify forgot password OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}