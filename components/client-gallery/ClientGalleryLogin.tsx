"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/lib/content";
import { parseGalleryAccessInput } from "@/lib/client-gallery/access";

export function ClientGalleryLogin() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = parseGalleryAccessInput(value);
    if (!token) {
      setError("Enter the gallery link Andrea sent you.");
      return;
    }
    setError("");
    router.push(`/view/${token}`);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.14em] text-stone">
        {site.brand}
      </p>
      <h1 className="type-page-title mt-4 text-bark">Client login</h1>
      <p className="type-page-body mt-3 text-stone leading-relaxed">
        Paste the gallery link from your email. If the gallery is password
        protected, you’ll be asked for that next.
      </p>

      <form onSubmit={onSubmit} className="card mt-8 p-6">
        <label className="block text-sm text-bark">
          Gallery link
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="input mt-2 w-full"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="https://andreashirey.com/view/…"
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
          className="btn mt-6 w-full border-bark bg-bark text-cream"
        >
          Open gallery
        </button>
      </form>
    </div>
  );
}
