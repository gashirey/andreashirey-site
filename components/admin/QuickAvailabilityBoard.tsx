"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { todayFarmDate } from "@/lib/inventory/date";
import type { AvailabilityWithProduct } from "@/lib/inventory/types";

export function QuickAvailabilityBoard() {
  const [date, setDate] = useState(todayFarmDate());
  const [rows, setRows] = useState<AvailabilityWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/availability?date=${date}`);
    const data = await res.json();
    setRows(data.availability ?? []);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

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
    setMessage("");
    await load();
  }

  async function duplicate(id: string) {
    const res = await fetch(`/api/admin/availability/${id}/duplicate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available_date: date }),
    });
    if (res.ok) await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block text-sm">
          <span className="font-medium text-bark">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input mt-1"
          />
        </label>
        <Link href="/admin/availability/new" className="btn border-bark text-bark">
          Add listing
        </Link>
      </div>

      {message && <p className="text-sm text-bark">{message}</p>}

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-stone">
          No listings for this date.{" "}
          <Link href="/admin/availability/new" className="underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="border border-parchment bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-bark">{row.product?.name}</p>
                  <p className="text-xs text-stone">
                    ${Number(row.bunch_price).toFixed(2)} · {row.stems_per_bunch}{" "}
                    stems/bunch
                  </p>
                </div>
                <select
                  value={row.status}
                  onChange={(e) => patch(row.id, { status: e.target.value })}
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
                      patch(row.id, {
                        bunches_available: Number(e.target.value),
                      })
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
                    onBlur={(e) =>
                      patch(row.id, { bunch_price: Number(e.target.value) })
                    }
                    className="input mt-1 w-full"
                  />
                </label>
                <label className="flex items-end gap-2 text-xs pb-1">
                  <input
                    type="checkbox"
                    defaultChecked={row.show_on_website}
                    onChange={(e) =>
                      patch(row.id, { show_on_website: e.target.checked })
                    }
                    className="rounded-sm border-parchment"
                  />
                  Show on site
                </label>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <Link
                  href={`/admin/availability/${row.id}`}
                  className="text-salmon-dark underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => duplicate(row.id)}
                  className="text-stone underline"
                >
                  Duplicate to today
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
