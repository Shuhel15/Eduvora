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
