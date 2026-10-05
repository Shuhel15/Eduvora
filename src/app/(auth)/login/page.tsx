import type { Metadata } from "next";
import LoginForm from "@/components/auth/Login";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Eduvora account for AI career guidance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main>
      <Container>
        <LoginForm />
      </Container>
    </main>
  );
}

