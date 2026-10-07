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