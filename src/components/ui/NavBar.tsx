"use client";

import Link from "next/link";
import { useState } from "react";
import { Compass, Menu, X } from "lucide-react";

import ThemeToggle from "@/components/theme-toggle";
import AuthButton from "@/components/auth/AuthButton";
import { Container } from "../container";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <Container>
      <header className="sticky top-0 z-50 px-4 pt-5">
        <nav
          aria-label="Main navigation"
          className="flex min-h-14 items-center justify-between rounded-xl border border-black/10 bg-white/70 px-3.5 shadow-lg backdrop-blur-xl sm:min-h-16 sm:px-6 dark:border-white/10 dark:bg-black/60"
        >
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Eduvora home"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
          >
            <div className="bg-linear-to-br from-purple-600 to-purple-500 p-1.5 rounded-lg text-white">
              <Compass size={25} />
            </div>
            Eduvora
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            <li className="hover:transition-transform hover:-translate-y-0.5 duration-200">
              <Link
                href="/"
                className="text-md font-semibold text-black/70 transition-colors hover:text-black hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-md dark:text-white/70 dark:hover:text-white "
              >
                Home
              </Link>
            </li>

            <li className="hover:transition-transform hover:-translate-y-0.5 duration-200">
              <Link
                href="/about"
                className="text-md font-semibold text-black/70 transition-colors hover:text-black hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-md dark:text-white/70 dark:hover:text-white"
              >
                About
              </Link>
            </li>

            <li className="hover:transition-transform hover:-translate-y-0.5 duration-200">
              <Link
                href="/features"
                className="text-md font-semibold text-black/70 transition-colors hover:text-black hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-md dark:text-white/70 dark:hover:text-white"
              >
                Features
              </Link>
            </li>
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <AuthButton />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="rounded-lg p-2 text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {isOpen && (
          <div
            id="mobile-navigation"
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/90 md:hidden"
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-black/80 transition-colors hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-black/80 transition-colors hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/features"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-black/80 transition-colors hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Features
                  </Link>
                </li>

                <li className="mt-2 border-t border-black/10 pt-3 dark:border-white/10">
                  <AuthButton />
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
    </Container>
  );
}
