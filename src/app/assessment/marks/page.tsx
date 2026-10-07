import { auth } from "@/auth";
import MarksForm from "@/components/assessment/marks-form";
import { Container } from "@/components/container";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Marks",
  description: "Add marks for students in class 10 and 12.",
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
export default async function marksPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <Container>
      <main>
        <section
          area-labelledby="marks-heading"
          className="flex min-h-screen flex-col items-center justify-center mt-20"
        >
          <div className="flex flex-col justify-center ">
            <header className="text-center">
              <h1
                id="login-heading"
                className="text-4xl sm:text-4xl md:text-5xl font-black tracking-tight "
              >
                <span className="text-purple-500">Enter Marks</span> for more accurate <span className="text-emerald-500">career guidance</span>
              </h1>
              <p className="text-black/50 dark:text-white/50 py-4">
                By entering marks, you can receive personalized career guidance
                and recommendations based on your academic performance.
              </p>
            </header>
            <MarksForm/>
          </div>
        </section>
      </main>
    </Container>
  );
}
