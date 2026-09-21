import type { Metadata } from "next";
import LoginForm from "@/components/auth/Login";

export const metadata: Metadata = {
  title: "Login | Eduvora",
  description: "Sign in to your Eduvora account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main>
      <section
        aria-labelledby="login-heading"
        className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-center">
          <header className="text-center">
            <h1
              id="login-heading"
              className="text-4xl sm:text-4xl md:text-5xl font-bold tracking-tight "
            >
              Sign in to Eduvora
            </h1>
            <p className="font-medium py-2">
              Access your account for career guidence
            </p>
          </header>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
