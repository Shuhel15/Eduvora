"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";

import { Container } from "@/components/container";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	return (
		<Container>
			<main
				aria-labelledby="error-heading"
				className="flex min-h-screen items-center justify-center py-10 sm:py-16"
			>
				<section className="w-full max-w-2xl rounded-2xl border border-red-500/30 bg-white/60 p-6 text-center shadow-xl shadow-red-500/5 backdrop-blur-xl dark:bg-black/30 sm:p-10">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-500">
						<AlertTriangle className="h-8 w-8" aria-hidden="true" />
					</div>

					<div className="mx-auto mt-6 w-fit rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-500">
						Something went wrong
					</div>

					<h1
						id="error-heading"
						className="mt-5 text-3xl font-black tracking-tight sm:text-4xl"
					>
						We couldn&apos;t load this page
					</h1>

					<p className="mx-auto mt-3 max-w-lg text-sm text-gray-600 dark:text-gray-300 sm:text-base">
						An unexpected error interrupted your Eduvora journey. Please try
						reloading the page or return to the home screen.
					</p>

					<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
						<button
							type="button"
							onClick={() => reset()}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:scale-102 hover:opacity-90 dark:bg-white dark:text-black"
						>
							<RefreshCw className="h-4 w-4" aria-hidden="true" />
							Try again
						</button>

						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-black/5 px-5 py-3 text-sm font-semibold transition hover:scale-102 hover:border-emerald-500 hover:text-emerald-500 dark:border-white/10 dark:bg-white/5"
						>
							<Home className="h-4 w-4" aria-hidden="true" />
							Back to home
						</Link>
					</div>

					{error.digest && (
						<p className="mt-6 text-xs text-gray-400">
							Reference: {error.digest}
						</p>
					)}

					<Link
						href="/"
						className="mt-8 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition hover:text-purple-500 dark:text-gray-400"
					>
						<ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
						Continue browsing Eduvora
					</Link>
				</section>
			</main>
		</Container>
	);
}
