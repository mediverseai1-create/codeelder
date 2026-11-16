"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Mode = "login" | "signup" | "forgot" | "reset";
const TITLES: Record<Mode, string> = {
  login: "Welcome back", signup: "Create your account", forgot: "Reset your password", reset: "Choose a new password",
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(params.get("error") === "config" ? "The app is not connected to Supabase yet. Set the environment variables." : null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setNotice(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    const name = String(f.get("name") ?? "").trim();

    if (mode !== "forgot" && mode !== "reset" && !email) return setError("Enter your email.");
    if ((mode === "signup" || mode === "reset") && password.length < 8) return setError("Password must be at least 8 characters.");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return setError("The app is not connected to Supabase yet.");

    setBusy(true);
    const supabase = createClient();
    const origin = window.location.origin;
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const next = params.get("next");
        router.replace(next && next.startsWith("/app") ? next : "/app");
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${origin}/auth/callback?next=/app` },
        });
        if (error) throw error;
        if (data.session) { router.replace("/app"); router.refresh(); }
        else setNotice("Check your email to confirm your account, then sign in.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
        setNotice("If that email has an account, a reset link is on its way.");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/app");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card w-full max-w-sm p-7">
      <h1 className="text-2xl font-bold">{TITLES[mode]}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        {mode === "signup" && (
          <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" className="input" autoComplete="name" /></div>
        )}
        {mode !== "reset" && (
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" autoComplete="email" required /></div>
        )}
        {mode !== "forgot" && (
          <div>
            <label className="label" htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label>
            <input id="password" name="password" type="password" className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} required />
          </div>
        )}
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        {notice && <p role="status" className="text-sm text-accent2">{notice}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Update password"}
        </button>
      </form>
      <div className="mt-5 space-y-1 text-center text-sm text-muted">
        {mode === "login" && <><p><Link href="/forgot-password" className="text-accent">Forgot password?</Link></p><p>New here? <Link href="/signup" className="text-accent">Create an account</Link></p></>}
        {mode === "signup" && <p>Already registered? <Link href="/login" className="text-accent">Sign in</Link></p>}
        {mode === "forgot" && <p><Link href="/login" className="text-accent">Back to sign in</Link></p>}
      </div>
    </div>
  );
}
