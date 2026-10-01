"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return;

  if (session) {
    return (
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-1 hover:shadow-lg shadow-gray-300 dark:shadow-neutral-700 text-white bg-black dark:bg-white dark:text-black py-1 px-2 rounded-lg hover:transition-transform hover:-translate-y-0.5  duration-200 active:scale-100"
      >
        Logout
        <LogOut size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn(undefined, { callbackUrl: "/" })}
      className="flex items-center gap-1 hover:shadow-lg shadow-gray-300 dark:shadow-neutral-700 text-white bg-black dark:bg-white dark:text-black py-1 px-2 rounded-lg hover:transition-transform hover:-translate-y-0.5  duration-200 active:scale-100"
    >
      Login <LogIn size={18} />
    </button>
  );
}
