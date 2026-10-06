import type { Metadata } from "next";
import { Container } from "@/components/container";
import ForgotPasswordComponent from "@/components/auth/forgotpass";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Eduvora account password using the verification code sent to your email.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPassPage() {
  return (
    <main>
      <Container>
        <ForgotPasswordComponent/>
      </Container>
    </main>
  );
}

