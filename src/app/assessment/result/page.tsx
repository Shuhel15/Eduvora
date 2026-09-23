import type { Metadata } from "next";

import { auth } from "@/auth";
import { Container } from "@/components/container";
import ResultContent from "@/components/assessment/result";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Assessment Result",
  description: "View your assessment result",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResultPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <Container>
      <main className="min-h-screen">
        <ResultContent />
      </main>
    </Container>
  );
}