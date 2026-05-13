export default function FeatureCard({ title, description, icon, className = "" }) {
  return (
    <article className={`rounded-3xl border p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/80 text-xl shadow-sm dark:border-slate-700/80 dark:bg-slate-950/40">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
}
