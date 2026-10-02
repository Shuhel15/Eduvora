"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Compass,
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  LogOut,
  ChevronDown,
} from "lucide-react";

import ThemeToggle from "@/components/theme-toggle";
import { Container } from "../container";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: session, status } = useSession();

  const closeMenu = () => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const fullUserName = session?.user?.name || session?.user?.email || "User";
  const userName = fullUserName.trim().split(/\s+/)[0];
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 pt-5">
      <Container className="max-w-360">
        <nav
          aria-label="Main navigation"
          className="relative flex min-h-14 items-center justify-between rounded-xl border border-black/10 bg-white/70 px-3.5 shadow-lg backdrop-blur-xl sm:min-h-16 sm:px-6 dark:border-white/10 dark:bg-black/60"
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Eduvora home"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-black dark:text-white"
          >
            <div className="group rounded-lg bg-linear-to-br from-purple-600 to-purple-500 p-1.5 text-white">
              <Compass
                size={25}
                className="duration-300 group-hover:rotate-180"
              />
            </div>
            Eduvora
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <ul className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black/70 transition-transform duration-200 hover:-translate-y-1 hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black/70 transition-transform duration-200 hover:-translate-y-1 hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/features"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black/70 transition-transform duration-200 hover:-translate-y-1 hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  Features
                </Link>
              </li>
              {status === "authenticated" && (
                <>
                  {/* Dashboard */}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-black/70 transition-transform duration-200 hover:-translate-y-1 hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </ul>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {status === "authenticated" ? (
                <>
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((previous) => !previous)}
                      aria-expanded={isUserMenuOpen}
                      className="flex items-center gap-2  border rounded-full border-black/10 bg-black/5 px-2.5 py-1.5 transition-all hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      {/* Avatar */}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                        {userInitial}
                      </span>

                      {/* Name */}
                      <span className="max-w-28 truncate text-sm font-semibold text-black dark:text-white">
                        {userName}
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 text-black/60 transition-transform dark:text-white/60 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black">
                        {/* User info */}
                        <div className="border-b border-black/10 px-3 py-2.5 dark:border-white/10">
                          <p className="truncate text-sm font-semibold text-black dark:text-white">
                            {userName}
                          </p>

                          {session.user?.email && (
                            <p className="truncate text-xs text-black/50 dark:text-white/50">
                              {session.user.email}
                            </p>
                          )}
                        </div>

                        {/* Take Quiz */}
                        <Link
                          href="/assessment/class"
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        >
                          <GraduationCap className="h-4 w-4" />
                          Take Quiz
                        </Link>

                        {/* Logout */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 dark:bg-white dark:text-black"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            {status === "authenticated" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((previous) => !previous)}
                  aria-label="Open user menu"
                  aria-expanded={isUserMenuOpen}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white"
                >
                  {userInitial}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-black">
                    <div className="border-b border-black/10 px-3 py-2.5 dark:border-white/10">
                      <p className="truncate text-sm font-semibold text-black dark:text-white">
                        {userName}
                      </p>

                      {session.user?.email && (
                        <p className="truncate text-xs text-black/50 dark:text-white/50">
                          {session.user.email}
                        </p>
                      )}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/assessment/class"
                      onClick={closeMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Take Quiz
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
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

        {/* Mobile Navigation */}
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
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/features"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Features
                  </Link>
                </li>

                {status === "authenticated" ? (
                  <>
                    <li>
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/assessment/class"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Take Quiz
                      </Link>
                    </li>

                    <li className="mt-2 border-t border-black/10 pt-3 dark:border-white/10">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="mt-2 border-t border-black/10 pt-3 dark:border-white/10">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="block rounded-lg bg-black px-4 py-3 text-center text-sm font-semibold text-white dark:bg-white dark:text-black"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
