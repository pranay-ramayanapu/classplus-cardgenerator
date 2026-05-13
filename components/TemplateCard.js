import Link from "next/link";

export default function TemplateCard({ template }) {
  const positionMap = {
    "top-left": "items-start justify-start text-left",
    "top-right": "items-start justify-end text-right",
    "center": "items-center justify-center text-center",
    "bottom-left": "items-end justify-start text-left",
    "bottom-right": "items-end justify-end text-right",
  };

  const alignment = positionMap[template.textPosition] || positionMap.center;
  const profileAlignment = positionMap[template.profilePosition] || positionMap["top-right"];

  return (
    <Link
      href={`/editor?template=${template.id}`}
      className="group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-20px_rgba(15,23,42,0.25)] dark:border-slate-800 dark:bg-slate-900"
      aria-label={`Open ${template.title} in the editor`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={template.image}
          alt={template.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/20 to-transparent" />
        <div className={`absolute inset-0 flex p-5 ${alignment}`}>
          <div className="max-w-[85%] space-y-3 rounded-3xl bg-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                {template.category}
              </span>
              {template.premium ? (
                <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950">
                  Premium
                </span>
              ) : null}
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-tight text-white">{template.title}</h3>
          </div>
        </div>
        <div className={`absolute inset-0 flex p-5 ${profileAlignment}`}>
          <div className="rounded-full border border-white/20 bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
            {template.profilePosition.replace("-", " ")}
          </div>
        </div>
      </div>
    </Link>
  );
}
