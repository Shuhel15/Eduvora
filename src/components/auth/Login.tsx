"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Container } from "../container";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!result || result.error) {
      toast.error("Invalid email/password or email is not verified");
      return;
    }

    toast.success("Logged in successfully!");

    router.push("/");
    router.refresh();
  };

  async function handleGoogleLogin() {
    await signIn("google", {
      callbackUrl: "/",
    });
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="mt-10 flex flex-col justify-between gap-3">
          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="my-2 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button type="button" onClick={handleGoogleLogin}>
            Continue with Google
          </button>

          <Link
            href="/register"
            className="text-center text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700"
          >
            Don&apos;t have an account? Register
          </Link>
        </div>
      </form>
    </Container>
  );
}
