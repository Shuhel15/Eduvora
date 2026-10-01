"use client";

import { Container } from "@/components/container";

function SkeletonBlock({ className = "" }: { className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={`rounded-lg bg-black/5 dark:bg-white/10 ${className}`}
		/>
	);
}

function SkeletonCard() {
	return (
		<article className="rounded-2xl border border-black/10 bg-white/30 p-5 dark:border-white/10 dark:bg-white/5 sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<SkeletonBlock className="h-11 w-11 rounded-xl" />
				<SkeletonBlock className="h-4 w-16 rounded-full" />
			</div>

			<SkeletonBlock className="mt-5 h-8 w-20 rounded-md" />
			<SkeletonBlock className="mt-2 h-4 w-3/4" />
			<SkeletonBlock className="mt-2 h-3 w-1/2" />
		</article>
	);
}

function SkeletonResult() {
	return (
		<article className="rounded-2xl border border-black/10 bg-white/20 p-5 dark:border-white/10 dark:bg-white/5 sm:p-6">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-4">
					<SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

					<div className="w-full space-y-2">
						<div className="flex flex-wrap gap-2">
							<SkeletonBlock className="h-5 w-40" />
							<SkeletonBlock className="h-5 w-20 rounded-full" />
						</div>
						<SkeletonBlock className="h-4 w-48" />
						<SkeletonBlock className="h-3 w-28" />
					</div>
				</div>

				<div className="flex items-center justify-between gap-5 sm:justify-end">
					<SkeletonBlock className="h-10 w-14" />
					<SkeletonBlock className="h-10 w-28 rounded-xl" />
				</div>
			</div>
		</article>
	);
}

export default function Loading() {
	return (
		<Container>
			<main
				aria-busy="true"
				aria-label="Loading page content"
				className="min-h-screen space-y-8 py-8 sm:py-10"
			>
				<section className="flex flex-col justify-between gap-6 rounded-xl border border-purple-500/60 bg-purple-500/5 p-5 shadow-lg shadow-purple-500/5 sm:flex-row sm:items-center sm:p-8">
					<div className="w-full space-y-3">
						<SkeletonBlock className="h-7 w-40 rounded-xl bg-emerald-500/15 dark:bg-emerald-400/15" />
						<SkeletonBlock className="h-10 w-full max-w-lg rounded-md sm:h-12" />
						<SkeletonBlock className="h-4 w-4/5 max-w-md" />
					</div>

					<SkeletonBlock className="h-11 w-full rounded-xl sm:w-40" />
				</section>

				<section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<SkeletonCard key={index} />
					))}
				</section>

				<section>
					<div className="mb-5 flex items-center justify-between gap-4">
						<div className="space-y-2">
							<SkeletonBlock className="h-6 w-32" />
							<SkeletonBlock className="h-3 w-52" />
						</div>
						<SkeletonBlock className="h-9 w-32 rounded-xl" />
					</div>

					<div className="grid gap-4">
						{Array.from({ length: 3 }).map((_, index) => (
							<SkeletonResult key={index} />
						))}
					</div>
				</section>
			</main>
		</Container>
	);
}
