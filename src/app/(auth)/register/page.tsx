import type { Metadata } from "next";
import RegisterForm from "@/components/auth/Register";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new Eduvora account for AI career guidance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <main>
      <Container>
        <RegisterForm />
      </Container>
    </main>
  );
}

