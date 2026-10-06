import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { sendOtpEmail } from "@/lib/mail";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please ender a valid email address",
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

    if (user && user.emailVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await redis.set(
        `forgot-password:otp:${normalizedEmail}`,
        otp,
        "EX",
        60 * 10,
      );

      await redis.del(`forgot-password:verified:${normalizedEmail}`);

      await sendOtpEmail(normalizedEmail, otp, "password-reset");
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with this email exists, an OTP has been sent to the email address.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}
