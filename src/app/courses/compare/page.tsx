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