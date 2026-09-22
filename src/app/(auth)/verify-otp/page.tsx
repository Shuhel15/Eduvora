import type { Metadata } from "next";
import VerifyOtpForm from "@/components/auth/VerifyOtp";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "OTP Verification | Eduvora",
  description: "Verify your email with the OTP sent to your inbox.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyOtpPage() {
  return (
    <Container>
    <main>
      <section className="flex min-h-screen flex-col items-center justify-center ">
        <div className="flex flex-col justify-center">
          <header className="text-center">
            <h1
              id="verify-heading"
              className="text-4xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Verify your email
            </h1>

            <p className="py-2 font-medium">
              Enter the 6-digit OTP sent to your mail
            </p>
          </header>

          <VerifyOtpForm />
        </div>
      </section>
    </main>
    </Container>
  );
}