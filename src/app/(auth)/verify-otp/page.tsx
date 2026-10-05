import type { Metadata } from "next";
import VerifyOtpForm from "@/components/auth/VerifyOtp";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "OTP Verification",
  description: "Verify your email address with the OTP sent to your inbox.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyOtpPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6">
      <Container className="max-w-md w-full">
        <VerifyOtpForm />
      </Container>
    </main>
  );
}