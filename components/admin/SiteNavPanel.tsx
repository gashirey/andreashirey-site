"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNotice } from "@/components/admin/AdminNotice";
import type { SiteNavItemRow } from "@/lib/site-cms/types";

export function SiteNavPanel() {
  const [items, setItems] = useState<SiteNavItemRow[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [setupError, setSetupError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/site-nav");
    const data = await res.json();
    if (!res.ok) {
      setSetupError(data.error ?? "Could not load navigation.");
      return;
    }
    setItems((data.nav ?? []) as SiteNavItemRow[]);
    setSetupError("");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchItem(
    id: string,
    patch: Partial<Pick<SiteNavItemRow, "label" | "href" | "sort_order" | "is_visible">>,
  ) {
    const res = await fetch(`/api/admin/site-nav/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice({ type: "error", message: data.error ?? "Update failed." });
      return;
    }
    await load();
    setNotice({ type: "success", message: "Menu updated." });
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    const href = newHref.trim();
    if (!label || !href) return;

    const res = await fetch("/api/admin/site-nav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label,
        href,
        sort_order: (items.length + 1) * 10,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice({ type: "error", message: data.error ?? "Could not add link." });
      return;
    }

    setNewLabel("");
    setNewHref("");
    await load();
    setNotice({ type: "success", message: "Link added." });
  }

  async function removeItem(id: string) {
    if (!window.confirm("Remove this menu link?")) return;
    const res = await fetch(`/api/admin/site-nav/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setNotice({ type: "error", message: data.error ?? "Delete failed." });
      return;
    }
    await load();
    setNotice({ type: "success", message: "Link removed." });
  }

  if (setupError) {
    return <p className="text-sm text-bark">{setupError}</p>;
  }

  return (
    <div className="space-y-6">
      {notice && (
        <AdminNotice type={notice.type} message={notice.message} onDismiss={() => setNotice(null)} />
      )}

      <p className="text-sm text-stone max-w-xl">
        Controls header and footer links. Hidden items stay in admin but do not appear on the public site.
        Links must start with <code className="text-xs">/</code>.
      </p>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="border border-parchment bg-white p-4"
          >
            <div className="flex flex-wrap items-start gap-4">
              <label className="flex-1 min-w-[8rem] text-sm">
                Label
                <input
                  className="input mt-1 w-full"
                  defaultValue={item.label}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== item.label) {
                      void patchItem(item.id, { label: e.target.value.trim() });
                    }
                  }}
                />
              </label>
              <label className="flex-1 min-w-[10rem] text-sm">
                URL path
                <input
                  className="input mt-1 w-full font-mono text-xs"
                  defaultValue={item.href}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== item.href) {
                      void patchItem(item.id, { href: e.target.value.trim() });
                    }
                  }}
                />
              </label>
              <label className="w-20 text-sm">
                Order
                <input
                  type="number"
                  className="input mt-1 w-full"
                  defaultValue={item.sort_order}
                  onBlur={(e) => {
                    const sort_order = Number(e.target.value);
                    if (!Number.isNaN(sort_order) && sort_order !== item.sort_order) {
                      void patchItem(item.id, { sort_order });
                    }
                  }}
                />
              </label>
              <label className="flex items-end gap-2 pb-2 text-sm">
                <input
                  type="checkbox"
                  defaultChecked={item.is_visible}
                  onChange={(e) =>
                    void patchItem(item.id, { is_visible: e.target.checked })
                  }
                />
                Visible
              </label>
              <button
                type="button"
                className="text-xs text-stone underline hover:text-bark"
                onClick={() => void removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => void addItem(e)}
        className="border border-parchment bg-white p-4"
      >
        <h2 className="font-serif text-lg text-bark">Add link</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="text-sm">
            Label
            <input
              className="input mt-1"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              required
            />
          </label>
          <label className="text-sm">
            Path
            <input
              className="input mt-1 font-mono text-xs"
              placeholder="/flowers"
              value={newHref}
              onChange={(e) => setNewHref(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-secondary self-end text-sm">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
