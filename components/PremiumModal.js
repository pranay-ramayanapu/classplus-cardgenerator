"use client";

export default function PremiumModal({ open, onClose, onUpgrade, onContinueFree }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close premium modal"
        className="absolute inset-0 animate-[overlayFade_180ms_ease-out] bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_30px_120px_-35px_rgba(15,23,42,0.95)] animate-[modalPop_220ms_ease-out] sm:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_45%)]" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
            Premium Template
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Unlock premium greeting cards
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Upgrade to access premium-only templates and polished layouts for special occasions.
          </p>

          <div className="mt-6 space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
            <p>• Premium design library</p>
            <p>• Extra template styles</p>
            <p>• Priority export-ready layouts</p>
            <p>• Future customization tools</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onUpgrade}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Upgrade now
            </button>
            <button
              type="button"
              onClick={onContinueFree}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Continue with free templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
