"use client";

import { useState } from "react";
import { site } from "@/lib/content";

export function ClientGalleryLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/view/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json()) as { error?: string; share_path?: string };
    setLoading(false);

    if (!res.ok || !data.share_path) {
      setError(data.error ?? "Could not open gallery.");
      return;
    }

    window.location.href = data.share_path;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.14em] text-stone">
        {site.brand}
      </p>
      <h1 className="type-page-title mt-4 text-bark">Client login</h1>
      <p className="type-page-body mt-3 text-stone leading-relaxed">
        Enter the password Andrea sent you.
      </p>

      <form onSubmit={onSubmit} className="card mt-8 p-6">
        <label className="block text-sm text-bark">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input mt-2 w-full"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-bark" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !password.trim()}
          className="btn mt-6 w-full border-bark bg-bark text-cream disabled:opacity-50"
        >
          {loading ? "Checking…" : "View gallery"}
        </button>
      </form>
    </div>
  );
}
