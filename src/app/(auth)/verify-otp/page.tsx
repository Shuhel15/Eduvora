import type { Metadata } from "next";
import VerifyOtpPage from "@/components/auth/VerifyOtp";

export const metadata: Metadata = {
  title: "OTP Verification | Eduvora",
  description: "Verify your email with the OTP sent to your inbox.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main>
      <section
        aria-labelledby="verify-heading"
        className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-center">
          <header className="text-center">
            <h1
              id="login-heading"
              className="text-4xl sm:text-4xl md:text-5xl font-bold tracking-tight "
            >
              Verify your email
            </h1>
            <p className="font-medium py-2">
              Enter the 6-digit OTP sent to your mail
            </p>
          </header>
          <VerifyOtpPage />
        </div>
      </section>
    </main>
  );
}
