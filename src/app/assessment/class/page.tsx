import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import ClassSelection from "@/components/assessment/class-selection";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Class Selection",
  description: "Select your class level to proceed with the assessment.",
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
export default async function classPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <Container>
      <main>
        <section
          aria-labelledby="class-heading"
          className="flex h-auto flex-col items-center justify-center mt-20 mb-40 "
        >
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex justify-center">
              <div className="flex font-semibold items-center gap-2 rounded-full border-2 border-purple-500/25 bg-purple-500/25 px-2 py-1 text-sm text-purple-500">
                <GraduationCap size={18} />
                <p>Personalized for your class</p>
              </div>
            </div>
            <header className="text-center">
              <h1
                id="class-heading"
                className="text-4xl md:text-5xl font-black tracking-tight "
              >
                Which class  <span className="text-pink-500">are you in?</span>
              </h1>
              <p className="mt-5 font-semibold mb-5 text-sm text-gray-600 dark:text-gray-400 sm:text-base ">
                We&apos;ll customize your quiz based on your class
              </p>
            </header>
            <ClassSelection />
          </div>
        </section>
      </main>
    </Container>
  );
}
