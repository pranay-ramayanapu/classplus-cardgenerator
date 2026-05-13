"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import HomeNavbar from "@/components/HomeNavbar";
import TemplateCard from "@/components/TemplateCard";
import { signOutUser, watchAuthState } from "@/lib/auth";
import { db } from "@/lib/firebase";

const categories = ["All", "Birthday", "Anniversary", "Festivals", "Friendship"];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templateError, setTemplateError] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const unsubscribe = watchAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const response = await fetch("/templates/templates.json");
        if (!response.ok) {
          throw new Error("Unable to load templates.");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        setTemplateError(error.message || "Unable to load templates.");
      }
    }

    loadTemplates();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      if (!user || !db) {
        setProfile(null);
        return;
      }

      const snapshot = await getDoc(doc(db, "users", user.uid));
      setProfile(snapshot.exists() ? snapshot.data() : null);
    }

    loadProfile();
  }, [user]);

  async function handleSignOut() {
    await signOutUser();
    router.replace("/login");
  }

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesCategory = activeCategory === "All" || template.category === activeCategory;
      const searchText = [template.title, template.category, template.premium ? "premium" : "free"]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !normalizedQuery || searchText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query, templates]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-300">
        Loading your session...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.displayName || user.displayName || "Guest User";
  const email = profile?.email || user.email || "Guest session";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_45%),linear-gradient(to_bottom,rgba(15,23,42,1),rgba(2,6,23,1))] text-white">
      <HomeNavbar
        user={{ ...user, displayName, email }}
        search={query}
        onSearchChange={setQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSignOut={handleSignOut}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Greeting card templates for every occasion
            </span>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Design, search, and pick a greeting card in seconds.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Browse birthday, anniversary, festival, and friendship templates.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">User</p>
                <p className="mt-2 text-lg font-semibold text-white">{displayName}</p>
                <p className="mt-1 text-sm text-slate-400">{email}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Login type</p>
                <p className="mt-2 text-lg font-semibold text-white">{profile?.loginType || "Unknown"}</p>
                <p className="mt-1 text-sm text-slate-400">Saved in Firestore</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Templates</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              {filteredTemplates.length} templates found
            </h2>
          </div>
        </div>

        {templateError ? (
          <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {templateError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-300">
            No templates match your search right now.
          </div>
        ) : null}
      </section>
    </main>
  );
}
