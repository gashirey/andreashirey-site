"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { addFarmDays, todayFarmDate } from "@/lib/inventory/date";
import { isPubliclyVisible, publicVisibilityIssue } from "@/lib/inventory/listing-visibility";
import type { AvailabilityWithProduct, FarmProduct } from "@/lib/inventory/types";

const DEFAULT_LISTING = {
  bunch_price: 18,
  stems_per_bunch: 10,
  bunches_available: 5,
};

export function QuickAvailabilityBoard() {
  const [date, setDate] = useState(todayFarmDate());
  const [rows, setRows] = useState<AvailabilityWithProduct[]>([]);
  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [availRes, prodRes] = await Promise.all([
      fetch(`/api/admin/availability?date=${date}`, { cache: "no-store" }),
      fetch("/api/admin/products", { cache: "no-store" }),
    ]);
    const availData = await availRes.json();
    const prodData = await prodRes.json();
    setRows((availData.availability ?? []) as AvailabilityWithProduct[]);
    setProducts((prodData.products ?? []) as FarmProduct[]);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeProducts = products.filter((p) => p.is_active);
  const listedIds = new Set(rows.map((r) => r.product_id));
  const unlistedActive = activeProducts.filter((p) => !listedIds.has(p.id));

  const visibleRows = rows.filter((r) => isPubliclyVisible(r, date));
  const hiddenRows = rows.filter((r) => !isPubliclyVisible(r, date));

  async function patch(id: string, updates: Record<string, unknown>) {
    const res = await fetch(`/api/admin/availability/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ?? "Update failed.");
      return;
    }
    setMessage("Updated.");
    await load();
  }

  async function quickList(productId: string) {
    setBusyId(productId);
    setMessage("");
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        available_date: date,
        status: "available",
        show_on_website: true,
        harvest_date: date,
        ...DEFAULT_LISTING,
      }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setMessage(data.error ?? "Could not create listing.");
      return;
    }
    setMessage("Listed on site for this date.");
    await load();
  }

  async function copyFromYesterday() {
    setMessage("Copying…");
    const y = addFarmDays(date, -1);
    const res = await fetch(`/api/admin/availability?date=${y}`, { cache: "no-store" });
    const data = await res.json();
    const prev = (data.availability ?? []) as AvailabilityWithProduct[];
    if (!prev.length) {
      setMessage("No listings yesterday to copy.");
      return;
    }
    const already = new Set(rows.map((r) => r.product_id));
    let copied = 0;
    for (const row of prev) {
      if (!row.product?.is_active) continue;
      if (already.has(row.product_id)) continue;
      const post = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: row.product_id,
          available_date: date,
          status: row.status === "limited" ? "limited" : "available",
          bunch_price: row.bunch_price,
          stems_per_bunch: row.stems_per_bunch,
          bunches_available: row.bunches_available,
          notes: row.notes,
          show_on_website: true,
          harvest_date: date,
        }),
      });
      if (post.ok) {
        copied += 1;
        already.add(row.product_id);
      }
    }
    setMessage(
      copied
        ? `Copied ${copied} listing(s) from yesterday.`
        : "Nothing new to copy (already listed or inactive).",
    );
    await load();
  }

  return (
    <div className="space-y-8">
      <div className="border border-parchment bg-sage-light/40 p-4 text-sm text-stone">
        <p className="font-medium text-bark">How the public page works</p>
        <p className="mt-2">
          <strong>Active</strong> in Products only means it exists in your catalog.
          The website shows products you <strong>list for a date</strong> below with
          &ldquo;Show on site&rdquo; and status Available or Limited.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="block text-sm">
          <span className="font-medium text-bark">Listing date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input mt-1"
          />
        </label>
        <button
          type="button"
          onClick={() => void copyFromYesterday()}
          className="btn border-bark text-bark"
        >
          Copy yesterday&apos;s list
        </button>
        <Link href="/admin/availability/new" className="btn border-bark bg-bark text-cream">
          Add listing (full form)
        </Link>
      </div>

      {message ? (
        <p className="border border-parchment bg-white px-4 py-3 text-sm text-bark" role="status">
          {message}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : (
        <>
          <section>
            <h2 className="font-serif text-lg text-bark">
              On site ({visibleRows.length})
            </h2>
            <p className="mt-1 text-sm text-stone">
              These appear on Available Now for {date}.
            </p>
            {visibleRows.length === 0 ? (
              <p className="mt-4 text-sm text-stone">None yet — list products below.</p>
            ) : (
              <ListingCards rows={visibleRows} date={date} onPatch={patch} />
            )}
          </section>

          {hiddenRows.length > 0 ? (
            <section>
              <h2 className="font-serif text-lg text-bark">
                Listed but not on site ({hiddenRows.length})
              </h2>
              <p className="mt-1 text-sm text-stone">
                Fix these — visitors will not see them.
              </p>
              <ul className="mt-4 space-y-2">
                {hiddenRows.map((row) => (
                  <li
                    key={row.id}
                    className="border border-parchment bg-white px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-bark">{row.product?.name}</span>
                    <span className="text-stone">
                      {" "}
                      — {publicVisibilityIssue(row, date)}
                    </span>
                    {row.product && !row.product.is_active ? (
                      <span className="mt-1 block text-xs text-stone">
                        <Link href="/admin/products" className="underline">
                          Activate product
                        </Link>{" "}
                        or remove this listing.
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <ListingCards rows={hiddenRows} date={date} onPatch={patch} compact />
            </section>
          ) : null}

          <section>
            <h2 className="font-serif text-lg text-bark">
              Active products — not listed ({unlistedActive.length})
            </h2>
            <p className="mt-1 text-sm text-stone">
              One click adds a default listing for {date}.
            </p>
            {unlistedActive.length === 0 ? (
              <p className="mt-4 text-sm text-stone">
                All active products have a listing for this date.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-parchment border border-parchment bg-white">
                {unlistedActive.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-bark">{p.name}</p>
                      {p.description ? (
                        <p className="line-clamp-1 text-xs text-stone">{p.description}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => void quickList(p.id)}
                      className="text-sm font-medium text-salmon-dark underline underline-offset-2 disabled:opacity-50"
                    >
                      {busyId === p.id ? "Listing…" : "List for this date"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ListingCards({
  rows,
  date,
  onPatch,
  compact = false,
}: {
  rows: AvailabilityWithProduct[];
  date: string;
  onPatch: (id: string, updates: Record<string, unknown>) => void;
  compact?: boolean;
}) {
  return (
    <div className="mt-4 space-y-3">
      {rows.map((row) => (
        <div
          key={row.id}
          className={`border border-parchment bg-white ${compact ? "p-3" : "p-4"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-bark">{row.product?.name}</p>
              {!compact ? (
                <p className="text-xs text-stone">
                  ${Number(row.bunch_price).toFixed(2)} · {row.stems_per_bunch} stems/bunch
                </p>
              ) : null}
            </div>
            <select
              value={row.status}
              onChange={(e) => onPatch(row.id, { status: e.target.value })}
              className="input py-1 text-sm"
            >
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="sold_out">Sold out</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="block text-xs">
              Bunches
              <input
                type="number"
                min={0}
                defaultValue={row.bunches_available}
                onBlur={(e) =>
                  onPatch(row.id, { bunches_available: Number(e.target.value) })
                }
                className="input mt-1 w-full"
              />
            </label>
            <label className="block text-xs">
              Price ($)
              <input
                type="number"
                min={0}
                step="0.01"
                defaultValue={row.bunch_price}
                onBlur={(e) => onPatch(row.id, { bunch_price: Number(e.target.value) })}
                className="input mt-1 w-full"
              />
            </label>
            <label className="flex items-end gap-2 pb-1 text-xs">
              <input
                type="checkbox"
                defaultChecked={row.show_on_website}
                onChange={(e) => onPatch(row.id, { show_on_website: e.target.checked })}
                className="rounded-sm border-parchment"
              />
              Show on site
            </label>
          </div>

          {!compact ? (
            <p className="mt-2 text-xs text-stone">
              {isPubliclyVisible(row, date)
                ? "Visible on public site"
                : publicVisibilityIssue(row, date)}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}