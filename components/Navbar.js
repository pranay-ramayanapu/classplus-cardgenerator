import Link from "next/link";

const links = [
  { href: "#features", label: "Features" },
  { href: "#firebase", label: "Firebase" },
  { href: "#structure", label: "Structure" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
          classplus
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#firebase"
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        >
          Set up Firebase
        </a>
      </div>
    </header>
  );
}
