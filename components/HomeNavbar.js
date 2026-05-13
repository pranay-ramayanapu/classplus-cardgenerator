"use client";

import Link from "next/link";

export default function HomeNavbar({ user, search, onSearchChange, categories, activeCategory, onCategoryChange, onSignOut }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/home" className="font-display text-xl font-semibold tracking-tight text-white">
              cardcraft
            </Link>
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-sm font-bold text-slate-950">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "Profile"} className="h-full w-full object-cover" />
                  ) : (
                    (user?.displayName || user?.email || "G").slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{user?.displayName || "Guest"}</p>
                  <p className="text-xs text-slate-400">{user?.email || "Guest session"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <label className="relative w-full lg:max-w-xl">
              <span className="sr-only">Search templates</span>
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search birthday, festival, premium, or title"
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 pl-11 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-sky-400/70 focus:bg-white/10 focus:ring-4 focus:ring-sky-500/20"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            </label>
            <div className="flex flex-wrap gap-2 lg:justify-center">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-slate-950 shadow-lg shadow-sky-500/20"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-sm font-bold text-slate-950">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "Profile"} className="h-full w-full object-cover" />
                ) : (
                  (user?.displayName || user?.email || "G").slice(0, 1).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.displayName || "Guest"}</p>
                <p className="text-xs text-slate-400">{user?.email || "Guest session"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
