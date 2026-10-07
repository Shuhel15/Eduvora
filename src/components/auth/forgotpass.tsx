"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Compass,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Unable to send OTP.");
        return;
      }
      toast.success("OTP sent to your email.");
      setStep("otp");
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Invalid OTP.");
        return;
      }
      toast.success("OTP verified successfully.");
      setStep("password");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;
    setResending(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Unable to resend OTP.");
        return;
      }
      setOtp("");
      toast.success("A new OTP has been sent.");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasMinLen || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character.",
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.message || "Unable to reset password.");
        return;
      }
      toast.success("Password reset successfully.");
      setStep("success");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: "email", label: "Email" },
    { id: "otp", label: "Verify" },
    { id: "password", label: "Password" },
  ];
  const currentStepIndex =
    step === "email" ? 0 : step === "otp" ? 1 : step === "password" ? 2 : 3;

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white/40 py-3 pl-10 pr-4 text-sm text-black outline-none backdrop-blur-md transition placeholder:text-black/35 focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30";
  const buttonClass =
    "group flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/30 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg";

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto my-8 grid w-full max-w-6xl min-w-0 overflow-x-hidden px-4 sm:my-12 sm:px-6 lg:my-20 lg:grid-cols-2 lg:px-0"
    >
      <div className="hidden min-w-0 overflow-hidden rounded-l-3xl border border-pink-500 bg-pink-500/15 p-6 backdrop-blur-xs lg:flex lg:flex-col lg:p-7">
        <Link
          href="/"
          aria-label="Eduvora forgot password"
          className="flex w-fit items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
        >
          <div className="group rounded-lg bg-linear-to-br from-purple-600 to-purple-500 p-1.5 text-white shadow-md shadow-purple-500/20">
            <Compass
              size={22}
              strokeWidth={2.2}
              className="transition-transform duration-500 group-hover:rotate-180"
            />
          </div>
          <span>Eduvora</span>
        </Link>

        <div className="my-auto py-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs font-semibold text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>Secure Account Recovery</span>
          </div>
          <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-black dark:text-white lg:text-4xl xl:text-5xl">
            Get Back To Your
            <br />
            <span className="bg-linear-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Career Journey.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-black/55 dark:text-white/50 lg:text-base">
            Verify your identity and create a new password to continue exploring
            your future with Eduvora.
          </p>
          <div className="mt-7 space-y-2.5">
            {[
              ["🔐", "Protected password recovery", "bg-emerald-500/10"],
              ["✉️", "Email verification at every step", "bg-indigo-500/10"],
              ["🚀", "Return to your personalized guidance", "bg-cyan-500/10"],
            ].map(([icon, text, color]) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/30 px-3 py-2.5 dark:border-white/10 dark:bg-white/4"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base ${color}`}
                >
                  {icon}
                </span>
                <span className="truncate text-sm font-semibold text-black dark:text-white">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-black/5 bg-white/30 px-4 py-3 dark:border-white/10 dark:bg-white/4">
          <p className="text-sm font-medium leading-5 text-black/55 dark:text-white/50">
            “A secure reset today keeps your goals moving forward tomorrow.”
          </p>
        </div>
      </div>

      <div className="min-w-0 w-full rounded-3xl border border-purple-500 bg-purple-500/15 p-6 backdrop-blur-xs sm:p-8 lg:rounded-l-none lg:rounded-r-3xl">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="group mx-auto mb-5 flex w-fit items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-400">
              <Compass
                size={16}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
              <span>Eduvora</span>
            </p>
            <div className="mb-4 inline-flex rounded-2xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
              {step === "email" && <KeyRound className="h-6 w-6" />}
              {step === "otp" && <ShieldCheck className="h-6 w-6" />}
              {step === "password" && <Lock className="h-6 w-6" />}
              {step === "success" && (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">
              {step === "email" && "Forgot Password?"}
              {step === "otp" && "Verify Your Email"}
              {step === "password" && "Create New Password"}
              {step === "success" && "Password Updated"}
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-black/50 dark:text-white/50">
              {step === "email" &&
                "Enter your verified email address and we'll send you a password reset code."}
              {step === "otp" && `Enter the 6-digit code sent to ${email}.`}
              {step === "password" &&
                "Create a strong new password for your Eduvora account."}
              {step === "success" &&
                "Your password has been changed successfully. You can now sign in with your new password."}
            </p>
          </div>

          {step !== "success" && (
            <div className="mb-8 flex items-center justify-center">
              {steps.map((item, index) => {
                const completed = index < currentStepIndex;
                const active = index === currentStepIndex;
                return (
                  <div key={item.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${completed ? "bg-emerald-500 text-white" : active ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" : "border border-black/10 bg-black/5 text-black/40 dark:border-white/10 dark:bg-white/5 dark:text-white/40"}`}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-black/40 dark:text-white/40">
                        {item.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`mx-2 mb-5 h-px w-8 sm:w-12 ${index < currentStepIndex ? "bg-emerald-500" : "bg-black/10 dark:bg-white/10"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35 dark:text-white/35" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={inputClass}
                />
              </div>
              <button type="submit" disabled={loading} className={buttonClass}>
                {loading ? "Sending OTP..." : "Send Reset OTP"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
              <Link
                href="/login"
                className="group flex items-center justify-center gap-1.5 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to login
              </Link>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <label
                htmlFor="otp"
                className="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                required
                className="w-full rounded-xl border border-black/10 bg-white/40 px-4 py-4 text-center text-2xl font-bold tracking-[0.45em] text-black outline-none backdrop-blur-md transition placeholder:text-black/20 focus:border-purple-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20"
              />
              <button type="submit" disabled={loading} className={buttonClass}>
                {loading ? "Verifying..." : "Verify OTP"}
                {!loading && (
                  <ShieldCheck className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                )}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                  }}
                  className="font-semibold text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="font-semibold text-purple-600 transition hover:text-purple-700 disabled:opacity-50 dark:text-purple-400"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35 dark:text-white/35" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/35 transition hover:text-black dark:text-white/35 dark:hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                    <PasswordCheck valid={hasMinLen} text="Min 6 characters" />
                    <PasswordCheck
                      valid={hasUpper && hasLower}
                      text="Upper & lowercase"
                    />
                    <PasswordCheck valid={hasNumber} text="Number" />
                    <PasswordCheck
                      valid={hasSpecial}
                      text="Special character"
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35 dark:text-white/35" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    required
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/35 transition hover:text-black dark:text-white/35 dark:hover:text-white"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p
                    className={`mt-2 text-xs font-medium ${password === confirmPassword ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading} className={buttonClass}>
                {loading ? "Updating Password..." : "Reset Password"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className={buttonClass}
                >
                  Continue to Login
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {step !== "success" && (
            <div className="mt-7 flex items-center justify-center gap-2 text-[11px] font-medium text-black/35 dark:text-white/35">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Your account security is our priority</span>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
}

function PasswordCheck({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 ${valid ? "text-emerald-500" : "text-black/35 dark:text-white/35"}`}
    >
      <CheckCircle2 className="h-3 w-3 shrink-0" />
      <span>{text}</span>
    </div>
  );
}
