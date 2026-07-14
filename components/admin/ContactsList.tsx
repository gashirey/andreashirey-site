"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactRow } from "@/lib/contacts/types";

function displayName(c: ContactRow): string {
  return (
    c.full_name?.trim() ||
    [c.first_name, c.last_name].filter(Boolean).join(" ").trim() ||
    "—"
  );
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ContactsList() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not load contacts.");
      setContacts([]);
      return;
    }
    setError("");
    setContacts((data.contacts ?? []) as ContactRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-stone">Loading contacts…</p>;
  }

  if (error) {
    return <p className="text-sm text-bark">{error}</p>;
  }

  if (!contacts.length) {
    return (
      <p className="text-sm text-stone">
        No contacts in the database yet. Submissions from the public contact
        form and session inquire form will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone">
        {contacts.length} contact{contacts.length === 1 ? "" : "s"}
      </p>
      <ul className="divide-y divide-parchment border border-parchment bg-white">
        {contacts.map((c) => (
          <li key={c.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[1fr_auto]">
            <div className="min-w-0 space-y-1">
              <p className="font-medium text-bark">{displayName(c)}</p>
              <p className="text-sm text-stone">
                {c.email ? (
                  <a
                    href={`mailto:${c.email}`}
                    className="underline underline-offset-2 hover:text-bark"
                  >
                    {c.email}
                  </a>
                ) : (
                  "No email"
                )}
                {c.phone ? ` · ${c.phone}` : ""}
              </p>
              <p className="text-xs text-stone">
                {c.source}
                {c.customer_type ? ` · ${c.customer_type}` : ""}
                {c.needs_review ? " · needs review" : ""}
              </p>
              {c.notes ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-bark">
                  {c.notes}
                </p>
              ) : null}
            </div>
            <p className="shrink-0 text-xs text-stone sm:text-right">
              {formatWhen(c.created_at)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
