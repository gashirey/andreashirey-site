"use client";

import { useState } from "react";
import { site } from "@/lib/content";

type ClientGalleryPasswordGateProps = {
  token: string;
  title: string;
  shootName: string;
};

export function ClientGalleryPasswordGate({
  token,
  title,
  shootName,
}: ClientGalleryPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/view/${token}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not unlock gallery.");
      return;
    }

    window.location.reload();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.14em] text-stone">
        {site.brand}
      </p>
      <h1 className="type-page-title mt-4 text-bark">{title}</h1>
      <p className="type-page-body mt-3 text-stone">{shootName}</p>

      <form onSubmit={onSubmit} className="card mt-8">
        <label className="block text-sm text-bark">
          Gallery password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="input mt-2 w-full"
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

      <p className="type-page-body mt-6 text-center text-stone">
        Password provided by Andrea with your gallery link.
      </p>
    </div>
  );
}
