import { Metadata } from "next";
import RegisterForm from "@/components/auth/Register";

export const metadata: Metadata = {
  title: "Register | Eduvora",
  description: "Create a new Eduvora account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <main>
      <section
        aria-labelledby="register-heading"
        className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-center">
          <header className="text-center">
            <h1
              id="register-heading"
              className="text-4xl sm:text-4xl md:text-5xl font-bold tracking-tight "
            >
              Create your Eduvora account
            </h1>
            <p className="font-medium py-2">
              Join us for career guidance and opportunities
            </p>
          </header>
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
