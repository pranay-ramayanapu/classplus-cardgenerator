"use client";

import Link from "next/link";

export default function AuthCard({
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLinkLabel,
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_55%),linear-gradient(to_bottom,rgba(248,250,252,1),rgba(241,245,249,1))] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_55%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(15,23,42,1))] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
              Firebase Authentication
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {footerText} <Link href={footerHref} className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">{footerLinkLabel}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
