import Link from "next/link";
import { ArrowLeft, Compass, Home, Sparkles } from "lucide-react";

import { Container } from "@/components/container";

export default function NotFound() {
	return (
		<Container>
			<main
				aria-labelledby="not-found-heading"
				className="flex min-h-screen items-center justify-center py-10 sm:py-16"
			>
				<section className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-purple-500/40 p-6 text-center sm:p-10">
					<div className="relative">
						<div className="group mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/25 text-purple-500">
							<Compass className="h-8 w-8 transition-transform group-hover:rotate-180 duration-300" aria-hidden="true" />
						</div>

						<p className="mt-6 text-7xl font-black tracking-tighter text-purple-500 sm:text-8xl">
							404
						</p>

						<div className="mx-auto mt-2 w-fit rounded-full border border-emerald-500/25 px-4 py-2 text-sm font-semibold text-emerald-500">
							Page not found
						</div>

						<h1
							id="not-found-heading"
							className="mt-5 text-3xl font-black tracking-tight sm:text-4xl"
						>
							Looks like you took a wrong turn
						</h1>

						<p className="mx-auto mt-3 max-w-lg text-sm text-gray-600 dark:text-gray-300 sm:text-base">
							This page doesn&apos;t exist or may have moved. Let&apos;s get you back
							on track with your career journey.
						</p>

						<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
							<Link
								href="/"
								className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold transition hover:scale-102 hover:border-purple-500 hover:text-purple-500 dark:border-white/10"
							>
								<Home className="h-4 w-4" aria-hidden="true" />
								Back to home
							</Link>

							<Link
								href="/assessment/class"
								className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold transition hover:scale-102 hover:border-purple-500 hover:text-purple-500 dark:border-white/10"
							>
								<Sparkles className="h-4 w-4 text-yellow-500" aria-hidden="true" />
								Start an assessment
							</Link>
						</div>

						<Link
							href="/"
							className="group mt-8 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition hover:text-purple-500 dark:text-gray-400"
						>
							<ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 duration-300 " aria-hidden="true" />
							Continue browsing Eduvora
						</Link>
					</div>
				</section>
			</main>
		</Container>
	);
}
