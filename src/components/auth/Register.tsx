"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Compass,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simple client-side password validations
  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      toast.error("Name can only contain letters and spaces.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!hasMinLen || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      toast.error(
        "Password must be at least 6 characters and include uppercase, lowercase, number, and special character (@$!%*?&).",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

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
        setLoading(false);
        toast.error(data.message || "Registration failed. Please try again.");
        return;
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
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto my-8 grid w-full max-w-6xl min-w-0 grid-cols-1 overflow-x-hidden px-4 sm:my-12 sm:px-6 lg:my-16 lg:grid-cols-2 lg:px-4 xl:px-0"
    >
      <div className="hidden min-w-0 overflow-hidden rounded-3xl border border-emerald-500 bg-emerald-500/15 p-6 backdrop-blur-xs lg:flex lg:flex-col lg:rounded-l-3xl lg:rounded-r-none lg:p-7">
        <Link
          href="/"
          aria-label="Eduvora registration"
          className="flex w-fit min-w-0 items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
        >
          <div className="group shrink-0 rounded-lg bg-linear-to-br from-emerald-600 to-emerald-500 p-1.5 text-white shadow-md shadow-emerald-500/20">
            <Compass
              size={22}
              strokeWidth={2.2}
              className="transition-transform duration-500 group-hover:rotate-180"
            />
          </div>

          <span>Eduvora</span>
        </Link>

        {/* Main Content */}
        <div className="my-auto min-w-0 py-8">
          {/* Badge */}
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
            Start Your Journey
          </div>

          {/* Heading */}
          <h2 className="max-w-full text-3xl font-black leading-[1.08] tracking-tight text-black dark:text-white lg:text-4xl xl:text-5xl">
            Build Your Future
            <br />
            With{" "}
            <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Better Direction.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-black/55 dark:text-white/50 lg:text-base">
            Create your Eduvora account and discover career opportunities that
            match your interests, strengths, and goals.
          </p>

          {/* Benefits */}
          <div className="mt-7 space-y-2.5">
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-base">
                🎯
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black dark:text-white">
                  Discover Your Strengths
                </p>

                <p className="truncate text-xs text-black/40 dark:text-white/40">
                  Understand what you are naturally good at
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-base">
                🧭
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black dark:text-white">
                  Find Your Direction
                </p>

                <p className="truncate text-xs text-black/40 dark:text-white/40">
                  Explore streams, courses, and career paths
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-base">
                🚀
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black dark:text-white">
                  Plan With Confidence
                </p>

                <p className="truncate text-xs text-black/40 dark:text-white/40">
                  Make smarter decisions for your future
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="rounded-xl border border-black/5 bg-white/30 px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-medium leading-5 text-black/55 dark:text-white/50">
            “The right career starts with understanding yourself.”
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-px w-5 bg-emerald-500/60" />

            <span className="text-[11px] font-semibold text-black/40 dark:text-white/40">
              Eduvora
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-0 w-full rounded-3xl border border-indigo-500 bg-indigo-500/15 p-5 backdrop-blur-xs sm:p-7 lg:rounded-l-none lg:rounded-r-3xl lg:p-8">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-400">
              <Compass className="h-3.5 w-3.5" />

              <span>Join Eduvora Today</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-black dark:text-white sm:text-3xl">
              Create your <span className="text-indigo-500">account</span>
            </h2>

            <p className="mt-2 text-xs font-medium text-black/45 dark:text-white/45 sm:text-sm">
              Start discovering the right path for your future.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
              >
                Full Name
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-black/35 dark:text-white/35">
                  <User className="h-4 w-4" />
                </div>

                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-4 text-sm text-black outline-none backdrop-blur-md transition-all duration-200 placeholder:text-black/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
              >
                Email Address
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-black/35 dark:text-white/35">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-4 text-sm text-black outline-none backdrop-blur-md transition-all duration-200 placeholder:text-black/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
              >
                Password
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-black/35 dark:text-white/35">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-10 text-sm text-black outline-none backdrop-blur-md transition-all duration-200 placeholder:text-black/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-black/35 transition-colors hover:text-black dark:text-white/35 dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Hints */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-1 pt-1.5 text-[11px]">
                  <div
                    className={`flex items-center gap-1 ${
                      hasMinLen
                        ? "text-emerald-500"
                        : "text-black/35 dark:text-white/35"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Min 6 chars</span>
                  </div>

                  <div
                    className={`flex items-center gap-1 ${
                      hasUpper && hasLower
                        ? "text-emerald-500"
                        : "text-black/35 dark:text-white/35"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Upper & lower</span>
                  </div>

                  <div
                    className={`flex items-center gap-1 ${
                      hasNumber
                        ? "text-emerald-500"
                        : "text-black/35 dark:text-white/35"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Number</span>
                  </div>

                  <div
                    className={`flex items-center gap-1 ${
                      hasSpecial
                        ? "text-emerald-500"
                        : "text-black/35 dark:text-white/35"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Special character</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
              >
                Confirm Password
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-black/35 dark:text-white/35">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-10 text-sm text-black outline-none backdrop-blur-md transition-all duration-200 placeholder:text-black/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-black/35 transition-colors hover:text-black dark:text-white/35 dark:hover:text-white"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs text-black/45 dark:text-white/40 sm:text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

            <span className="text-xs font-medium text-black/40 dark:text-white/40">
              OR
            </span>

            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm font-semibold text-black backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/60 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <FcGoogle
              size={18}
              className="duration-300 transition-transform group-hover:rotate-90"
            />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </motion.main>
  );
}
