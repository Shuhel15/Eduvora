"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  RotateCcw,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { motion } from "framer-motion";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // 6 individual digit inputs
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const otpString = digits.join("");

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first digit on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      return;
    }

    // Take the last character typed in this box
    const char = cleanValue.substring(cleanValue.length - 1);
    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);

    // Auto-advance to next box if available
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous input and clear it
        inputRefs.current[index - 1]?.focus();
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        setDigits(nextDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const nextDigits = Array(6).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      nextDigits[i] = pastedData[i];
    }
    setDigits(nextDigits);

    // Focus the box after the last pasted digit
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please check the URL or try registering again.");
      return;
    }

    if (otpString.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid OTP.");
        setLoading(false);
        return;
      }

      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!email || countdown > 0 || resending) return;

    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to resend OTP.");
        return;
      }

      toast.success("New OTP sent to your email!");
      setCountdown(60);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("An error occurred while resending OTP.");
    } finally {
      setResending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Background glow behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 blur-xl opacity-25 dark:opacity-35 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Badge & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <KeyRound className="h-3.5 w-3.5 text-emerald-500" />
            <span>Verification Step</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Verify your <span className="text-emerald-500">Email</span>
          </h2>

          {email ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 max-w-full">
              <Mail className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate font-medium">{email}</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-medium text-amber-500 flex items-center justify-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Email address not provided in link</span>
            </p>
          )}
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6 Digit Input Boxes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 text-center block">
              Enter 6-Digit Verification Code
            </label>

            <div className="flex justify-between items-center gap-2 sm:gap-2.5 pt-1">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 focus:outline-none ${
                    digit
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "border-black/15 dark:border-white/15 bg-white/60 dark:bg-white/5 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={loading || otpString.length !== 6 || !email}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-3.5 px-4 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify OTP</span>
                <CheckCircle2 className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="pt-2 text-center space-y-3">
          {countdown > 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5">
              <span>Didn&apos;t receive code? Resend in</span>
              <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {countdown}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || !email}
              className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {resending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Resending Code...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Resend Verification Code</span>
                </>
              )}
            </button>
          )}

          <div className="pt-2 border-t border-black/10 dark:border-white/10">
            <Link
              href="/login"
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors inline-flex items-center gap-1"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifyOtpForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}


