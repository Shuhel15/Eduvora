"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      console.log("Email is missing. Please go back and try again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid OTP.");
        return;
      }

      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function hadleResendOtp() {
    if (!email || countdown > 0) return;

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
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
      <form onSubmit={handleVerify}>
        <div className="mt-10 flex flex-col justify-between gap-3">
          <label htmlFor="otp">Enter OTP</label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

              setOtp(value);
            }}
            placeholder="Enter 6-digit OTP"
            className="w-full border px-4 py-3 text-center text-xl tracking-[0.5em] outline-none"
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {countdown > 0 ? (
            <p className="text-center">
              Resend OTP in {countdown}s
            </p>
          ) : (
            <button
              type="button"
              onClick={hadleResendOtp}
              disabled={resending}
              className="text-center text-blue-500 underline"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </form>
  );
}

export default function VerifyOtpForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}