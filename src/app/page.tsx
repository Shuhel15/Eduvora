import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Eduvora</h1>

        <p className="mt-3 text-gray-500">
          AI-powered career guidance for students
        </p>
        <Link
        href="/assessment/class"
        >
          Get Started
        </Link>

      </div>
    </main>
  );
}
