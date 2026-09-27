import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Container } from "@/components/container";
import { prisma } from "@/lib/prisma";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User's dashboard page",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const assessments = await prisma.assessment.findMany({
    where: {
      userId: session.user.id,
      status: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      class: true,
      status: true,
      aiResult: true,
      createdAt: true,
    },
  });

  return (
    <Container>
      <Dashboard
        userName={session.user.name ?? "Student"}
        assessments={assessments}
      />
    </Container>
  );
}