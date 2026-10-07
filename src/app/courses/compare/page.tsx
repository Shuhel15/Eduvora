import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {prisma} from "@/lib/prisma";
import { Container } from "@/components/container";
import CourseComparison from "@/components/course/course-comparison";
import { assessmentResultSchema } from "@/validations/assessment-result";

export const metadata: Metadata = {
  title: "Compare Courses | Eduvora",
  description: "Compare your recommended Class 12 courses.",
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

export default async function CompareCoursesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const assessment = await prisma.assessment.findFirst({
    where: {
      userId: session.user.id,
      class: 12,
      status: "COMPLETED",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      aiResult: true,
    },
  });

  if (!assessment?.aiResult) {
    return (
      <Container>
        <main className="py-8">
          <CourseComparison courses={[]} />
        </main>
      </Container>
    );
  }

  const parsed = assessmentResultSchema.safeParse(
    assessment.aiResult,
  );

  if (!parsed.success || parsed.data.classLevel !== "12") {
    return (
      <Container>
        <main className="py-8">
          <CourseComparison courses={[]} />
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <main className="py-8">
        <CourseComparison
          courses={parsed.data.recommendedCourses}
        />
      </main>
    </Container>
  );
}