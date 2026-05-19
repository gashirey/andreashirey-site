"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/content";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-parchment bg-white p-6"
      >
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">
          {site.name}
        </p>
        <h1 className="mt-2 font-serif text-2xl text-bark">Farm manage</h1>
        <p className="mt-2 text-sm text-stone">Enter your admin password.</p>

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mt-5 w-full"
          disabled={loading}
        />

        {error && (
          <p className="mt-2 text-sm text-bark" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn mt-4 w-full border-bark bg-bark text-white hover:bg-bark/90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
