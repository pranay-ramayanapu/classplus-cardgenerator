"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import templates from "@/data/editorTemplates.json";
import PositionChip from "@/components/PositionChip";
import PremiumModal from "@/components/PremiumModal";
import { captureCardAsPng, shareCardImage } from "@/lib/cardExport";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const [activeTemplateId, setActiveTemplateId] = useState(templates[0].id);
  const [userName, setUserName] = useState("Priya Sharma");
  const [profileImage, setProfileImage] = useState("/templates/friendship-sunshine.svg");
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) || templates[0],
    [activeTemplateId]
  );

  const freeFallback = useMemo(() => templates.find((template) => !template.premium) || templates[0], []);

  useEffect(() => {
    const templateId = searchParams.get("template");
    const requestedTemplate = templates.find((template) => template.id === templateId);

    if (!requestedTemplate) {
      return;
    }

    if (requestedTemplate.premium) {
      setPremiumOpen(true);
      setActiveTemplateId(freeFallback.id);
      return;
    }

    setActiveTemplateId(requestedTemplate.id);
  }, [freeFallback.id, searchParams]);

  function handleProfileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleTemplateSelect(template) {
    setMessage("");
    setError("");

    if (template.premium) {
      setPremiumOpen(true);
      return;
    }

    setActiveTemplateId(template.id);
  }

  function handleContinueFree() {
    setPremiumOpen(false);
    setActiveTemplateId(freeFallback.id);
  }

  async function handleExport() {
    setExporting(true);
    setMessage("");
    setError("");

    try {
      await captureCardAsPng(
        { template: activeTemplate, userName, profileImage },
        `${activeTemplate.title.replace(/\s+/g, "-").toLowerCase()}.png`
      );
      setMessage("Your card has been downloaded as PNG.");
    } catch (err) {
      setError(err?.message || "Unable to export the greeting card.");
    } finally {
      setExporting(false);
    }
  }

  async function handleShare() {
    setSharing(true);
    setMessage("");
    setError("");

    try {
      const result = await shareCardImage({ template: activeTemplate, userName, profileImage }, `${activeTemplate.title} greeting card`);

      if (result?.mode === "share") {
        setMessage("Native share sheet opened. Pick WhatsApp, Instagram, Email, or another app on your device.");
        return;
      }

      setMessage("Native share sheet opened.");
    } catch (err) {
      setError(err?.message || "Unable to open the native share sheet on this browser/device.");
    } finally {
      setSharing(false);
    }
  }

  const templateGroups = [
    { label: "Free", items: templates.filter((template) => !template.premium) },
    { label: "Premium", items: templates.filter((template) => template.premium) },
  ];

  function getOverlayStyle(position, anchor = "top-left", extraStyles = {}) {
    const isCentered = anchor === "center";

    return {
      position: "absolute",
      top: position.top,
      left: position.left,
      transform: isCentered ? "translate(-50%, -50%)" : "none",
      ...extraStyles,
    };
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%),linear-gradient(to_bottom,rgba(248,250,252,1),rgba(226,232,240,1))] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_45%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(15,23,42,1))] dark:text-slate-100 sm:px-6 lg:px-8">
      <PremiumModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        onUpgrade={() => setMessage("Premium checkout is not connected yet.")}
        onContinueFree={handleContinueFree}
      />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">
            Greeting Card Editor
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Build a modern card preview in real time.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Choose a template, update the recipient name, and position the profile image and text using template metadata.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="name">
                Username
              </label>
              <input
                id="name"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-sky-500 dark:focus:ring-sky-950/40"
                placeholder="Enter a name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="profile">
                Profile image
              </label>
              <input
                id="profile"
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:file:bg-white dark:file:text-slate-950"
              />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              Templates
            </p>
            {templateGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{group.label}</p>
                  <span className="text-xs text-slate-400">{group.items.length} cards</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.items.map((template) => {
                    const active = template.id === activeTemplateId;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template)}
                        className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 ${active ? "ring-2 ring-sky-400" : ""}`}
                      >
                        <div className="p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{template.title}</p>
                            {template.premium ? <span className="text-xs text-amber-500">Premium</span> : null}
                          </div>
                          <img src={template.image} alt={template.title} className="h-40 w-full rounded-lg object-cover" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || sharing}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {exporting ? "Downloading..." : "Download PNG"}
            </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={exporting || sharing}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                {sharing ? "Preparing share..." : "Share"}
              </button>
          </div>

          {(message || error) && (
            <div className="mt-4 space-y-3">
              {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {message}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 sm:p-6">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)]">
            <div className="relative aspect-[4/5] w-full">
              <img src={activeTemplate.image} alt={activeTemplate.title} className="h-full w-full object-cover" />

              <div
                className="absolute rounded-full border-4 border-white bg-white/10 p-1 shadow-lg backdrop-blur-md"
                style={getOverlayStyle(activeTemplate.profilePosition, "top-left", { zIndex: 20 })}
              >
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 sm:h-24 sm:w-24">
                  <img src={profileImage} alt="User profile" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

              <div
                className="absolute"
                style={getOverlayStyle(activeTemplate.textPosition, "top-left", {
                  zIndex: 20,
                  color: "white",
                  textShadow: "0 8px 24px rgba(15, 23, 42, 0.55)",
                })}
              >
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                  {userName || "Your Name"}
                </h2>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
