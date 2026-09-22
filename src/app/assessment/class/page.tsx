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
};
export default async function classPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <Container>
    <main>
      <section
        aria-labelledby="class-heading"
        className="flex h-auto flex-col items-center justify-center mt-20 "
      >
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex justify-center">
            <div className="flex font-semibold items-center gap-2 rounded-full border-2 border-purple-500/50 bg-purple-400/40 px-4 py-2 text-sm dark:text-purple-300 text-purple-500">
              <GraduationCap size={18} /><p>Personalized for your class</p>
            </div>
            
          </div>
          <header className="text-center">
            <h1
              id="class-heading"
              className="text-4xl md:text-5xl font-black tracking-tight "
            >
             Which class are you in?
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
