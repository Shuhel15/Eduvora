import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ResultContent() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          Assessment Submitted
        </h1>

        <p className="mt-2 text-gray-500">
          Assessment completed successfully.
        </p>

        <div className="mt-10 border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-sm">
            Assessment data successfully received.
            Gemini integration will be added in Phase 5.
          </p>
        </div>
      </div>
    </main>
  );
}