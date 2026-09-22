"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setLoading(false);
      toast.success(
        "Registration successful! Please check your email for OTP verification.",
      );
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleGoogleRegister = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 justify-between mt-10">
          <label htmlFor="email">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="email">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="flex items-center gap-3 my-2">
            <div className="h-px flex-1 bg-gray-300" />

            <span className="text-sm text-gray-500">OR</span>

            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <button type="button" onClick={handleGoogleRegister}>
            Continue with Google
          </button>
          <Link
            href="/login"
            className="text-sm text-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
  );
}
