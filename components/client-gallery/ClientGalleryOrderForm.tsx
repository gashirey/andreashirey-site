"use client";

import { useState } from "react";
import {
  formatPackagePrice,
  getDigitalPackage,
  type DigitalPackageId,
} from "@/lib/client-gallery/packages";

type ClientGalleryOrderFormProps = {
  token: string;
  packageId: DigitalPackageId;
  assetIds: string[];
  onClose: () => void;
  onSubmitted: () => void;
};

export function ClientGalleryOrderForm({
  token,
  packageId,
  assetIds,
  onClose,
  onSubmitted,
}: ClientGalleryOrderFormProps) {
  const pkg = getDigitalPackage(packageId);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!pkg) return null;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/view/${token}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageId,
        assetIds,
        clientName,
        clientEmail,
        notes,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not submit order.");
      return;
    }

    onSubmitted();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bark/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Submit digital order"
    >
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-stone">
              Digital order
            </p>
            <h2 className="mt-2 font-serif text-2xl text-bark">{pkg.label}</h2>
            <p className="mt-1 text-sm text-stone">
              {assetIds.length} photo{assetIds.length === 1 ? "" : "s"} ·{" "}
              {formatPackagePrice(pkg.priceCents)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn border-parchment py-1.5 text-sm"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-bark">
            Name
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="input mt-1"
              autoComplete="name"
              required
            />
          </label>
          <label className="block text-sm text-bark">
            Email
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="input mt-1"
              autoComplete="email"
              required
            />
          </label>
          <label className="block text-sm text-bark">
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input mt-1 min-h-[5rem]"
              rows={3}
            />
          </label>

          {error ? (
            <p className="text-sm text-bark" role="alert">
              {error}
            </p>
          ) : null}

          <p className="text-sm text-stone leading-relaxed">
            Submitting sends your selection to Andrea. She’ll confirm and share
            payment details for your digital files.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full border-bark bg-bark text-cream disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit order"}
          </button>
        </form>
      </div>
    </div>
  );
}
