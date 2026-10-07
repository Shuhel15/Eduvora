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
    keywords: [
    "Eduvora",
    "AI career guidance",
    "career guidance for students",
    "Class 10 career guidance",
    "Class 12 career guidance",
    "career options after 10th",
    "career options after 12th",
    "career guidance after 10th",
    "career guidance after 12th",
    "what to choose after 10th",
    "what to choose after 12th",
    "stream selection",
    "stream selection after 10th",
    "best stream after 10th",
    "Science stream",
    "Commerce stream",
    "Arts stream",
    "Humanities stream",
    "subject selection after 10th",
    "course selection after 12th",
    "course recommendation",
    "course comparison",
    "degree course guidance",
    "college selection guidance",
    "college guidance for students",
    "career aptitude assessment",
    "student career assessment",
    "AI career assessment",
    "personalized career recommendations",
    "career counselling",
    "career guidance India",
    "student career guidance",
    "career counselling for students",
    "online career counselling",
    "career planning for students",
    "best career options in India",
  ],
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
