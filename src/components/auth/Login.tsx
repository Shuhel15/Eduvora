"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Compass, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
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
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  async function handleGoogleLogin() {
    await signIn("google", {
      callbackUrl: "/",
    });
  }

  return (
    <main className="mx-auto my-8 grid w-full max-w-6xl min-w-0 overflow-x-hidden px-4 sm:my-12 sm:px-6 lg:my-20 lg:grid-cols-2 lg:px-0">
      {/* LEFT SIDE — Hidden on Mobile */}
      <div className="hidden min-w-0 overflow-hidden rounded-l-3xl border border-pink-500 bg-pink-500/15 p-6 backdrop-blur-xs lg:flex lg:flex-col lg:p-7">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Eduvora login"
          className="flex w-fit min-w-0 items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
        >
          <div className="group shrink-0 rounded-lg bg-linear-to-br from-purple-600 to-purple-500 p-1.5 text-white shadow-md shadow-purple-500/20">
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
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />
            <span>AI-Powered Career Guidance</span>
          </div>

          {/* Heading */}
          <h2 className="max-w-full text-3xl font-black leading-[1.08] tracking-tight text-black dark:text-white lg:text-4xl xl:text-5xl">
            Your Future Starts
            <br />
            With The{" "}
            <span className="bg-linear-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Right Direction.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-6 text-black/55 dark:text-white/50 lg:text-base">
            Discover the right stream, course, and career path based on your
            interests, strengths, and goals.
          </p>

          {/* Features */}
          <div className="mt-7 space-y-2.5">
            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-base">
                🎯
              </span>

              <span className="truncate text-sm font-semibold text-black dark:text-white">
                Personalized Career Recommendations
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-base">
                📚
              </span>

              <span className="truncate text-sm font-semibold text-black dark:text-white">
                Explore Streams & Courses
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-base">
                🚀
              </span>

              <span className="truncate text-sm font-semibold text-black dark:text-white">
                Plan Your Career With Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="rounded-xl border border-black/5 bg-white/30 px-4 py-3 dark:border-white/10 dark:bg-white/4">
          <p className="text-sm font-medium leading-5 text-black/55 dark:text-white/50">
            “Your career is a journey. Start it with clarity and the right
            direction.”
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — Login */}
      <div className="min-w-0 w-full rounded-3xl border border-purple-500 bg-purple-500/15 p-6 backdrop-blur-xs sm:p-8 lg:rounded-l-none lg:rounded-r-3xl">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="group mx-auto mb-5 flex w-fit flex-row items-center justify-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-center text-xs font-semibold text-purple-600 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-400">
              <Compass
                size={16}
                className="duration-300 transition-transform group-hover:rotate-180"
              />
              <span>Eduvora</span>
            </p>
            <h1 className="text-3xl text-center font-black tracking-tight text-black dark:text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-center text-black/50 dark:text-white/50">
              Sign in to continue your career journey with Eduvora.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
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
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-4 text-sm text-black outline-none backdrop-blur-md transition placeholder:text-black/35 focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-12 text-sm text-black outline-none backdrop-blur-md transition placeholder:text-black/35 focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 transition hover:text-black dark:text-white/40 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                onClick={() => router.push("/forgot-password")}
                type="button"
                className="text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition duration-300 ease-in-out hover:bg-purple-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-black/50 dark:text-white/50">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Create account
              </Link>
            </p>
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
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-sm font-semibold text-black backdrop-blur-md transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <FcGoogle
              size={18}
              className="duration-300 transition-transform group-hover:rotate-90"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}
