"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return;

  if (session) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-1 hover:shadow-lg shadow-gray-300 dark:shadow-neutral-700 text-white bg-black dark:bg-white dark:text-black py-1 px-2 rounded-lg hover:transition-transform hover:-translate-y-0.5  duration-200 active:scale-100"
      >
        Logout
        <LogOut size={18} />
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      type="button"
      onClick={() => signIn(undefined, { callbackUrl: "/" })}
      className="flex items-center gap-1 hover:shadow-lg shadow-gray-300 dark:shadow-neutral-700 text-white bg-black dark:bg-white dark:text-black py-1 px-2 rounded-lg hover:transition-transform hover:-translate-y-0.5  duration-200 active:scale-100"
    >
      Login <LogIn size={18} />
    </motion.button>
  );
}

