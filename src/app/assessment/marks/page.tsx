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
};
export default async function marksPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <Container>
      <main>
        <section
          area-labelledby="marks-heading"
          className="flex min-h-screen flex-col items-center justify-center mt-5"
        >
          <div className="flex flex-col justify-center ">
            <header className="text-center">
              <h1
                id="login-heading"
                className="text-4xl sm:text-4xl md:text-5xl font-black tracking-tight "
              >
                Enter Marks for more accurate career guidance
              </h1>
              <p className="text-zinc-500/80 font-semibold py-2">
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
