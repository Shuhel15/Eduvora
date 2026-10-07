import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import QuizForm from "@/components/assessment/quiz-form";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Career Assessment",
  description:
    "Take the career assessment to find out which career path suits you best.",
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

export default async function quizPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <Container>
      <main className="min-h-screen">
        <QuizForm />
      </main>
    </Container>
  );
}
