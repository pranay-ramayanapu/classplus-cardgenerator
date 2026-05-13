"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  signInAsGuest,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth";

const initialState = {
  displayName: "",
  email: "",
  password: "",
};

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [form, setForm] = useState(initialState);
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const title = useMemo(() => (isSignup ? "Create your account" : "Welcome back"), [isSignup]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function getFriendlyError(err) {
    const code = err?.code || "";

    if (code.includes("auth/popup-closed-by-user")) return "The Google popup was closed before sign in finished.";
    if (code.includes("auth/account-exists-with-different-credential")) return "That account already exists with a different login method.";
    if (code.includes("auth/email-already-in-use")) return "That email is already in use. Try logging in instead.";
    if (code.includes("auth/invalid-credential")) return "The provided credentials are invalid.";
    if (code.includes("auth/invalid-email")) return "Please enter a valid email address.";
    if (code.includes("auth/weak-password")) return "Choose a stronger password with at least 6 characters.";
    if (code.includes("auth/operation-not-allowed")) return "Enable this sign in method in Firebase Authentication first.";

    return err?.message || "Something went wrong. Please try again.";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoadingAction("email");

    try {
      if (isSignup) {
        await signUpWithEmail(form.email, form.password, form.displayName);
        setMessage("Account created successfully.");
      } else {
        await signInWithEmail(form.email, form.password);
        setMessage("Signed in successfully.");
      }
      router.replace("/home");
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoadingAction("");
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setMessage("");
    setLoadingAction("google");

    try {
      await signInWithGoogle();
      setMessage("Google login complete.");
      router.replace("/home");
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoadingAction("");
    }
  }

  async function handleGuestLogin() {
    setError("");
    setMessage("");
    setLoadingAction("guest");

    try {
      await signInAsGuest();
      setMessage("Signed in as guest.");
      router.replace("/home");
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoadingAction("");
    }
  }

  const buttonClass =
    "inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSignup && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="displayName">
              Full name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              value={form.displayName}
              onChange={updateField}
              placeholder="Jane Doe"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950/40"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={form.password}
            onChange={updateField}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950/40"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            {message}
          </div>
        )}

        <button type="submit" disabled={Boolean(loadingAction)} className={`${buttonClass} bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100`}>
          {loadingAction === "email" ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="space-y-3">
        <button type="button" disabled={Boolean(loadingAction)} onClick={handleGoogleLogin} className={`${buttonClass} border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`}>
          {loadingAction === "google" ? "Connecting Google..." : "Continue with Google"}
        </button>
        <button type="button" disabled={Boolean(loadingAction)} onClick={handleGuestLogin} className={`${buttonClass} border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-950/50`}>
          {loadingAction === "guest" ? "Starting guest session..." : "Continue as guest"}
        </button>
      </div>

      <p className="mt-6 text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
        Firebase Authentication only. User info is saved in Firestore after sign in.
      </p>
    </>
  );
}
