"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { todayFarmDate } from "@/lib/inventory/date";
import type {
  AvailabilityWithProduct,
  FarmProduct,
} from "@/lib/inventory/types";

type AvailabilityFormProps = {
  availability?: AvailabilityWithProduct;
};

export function AvailabilityForm({ availability }: AvailabilityFormProps) {
  const router = useRouter();
  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const list = (d.products ?? []) as FarmProduct[];
        const active = list.filter((p) => p.is_active);
        setProducts(active);
        if (d.error) {
          setError(d.error);
        } else if (!active.length && list.length) {
          setError("No active products. Activate products on the Products page.");
        }
      })
      .catch(() => setError("Could not load products."));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      product_id: form.get("product_id"),
      available_date: form.get("available_date"),
      status: form.get("status"),
      bunch_price: form.get("bunch_price"),
      stems_per_bunch: form.get("stems_per_bunch"),
      bunches_available: form.get("bunches_available"),
      harvest_date: form.get("harvest_date") || null,
      notes: form.get("notes"),
      display_order: form.get("display_order"),
      show_on_website: form.get("show_on_website") === "on",
    };

    const url = availability
      ? `/api/admin/availability/${availability.id}`
      : "/api/admin/availability";
    const method = availability ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Save failed.");
      return;
    }

    router.push("/admin/availability");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="block text-sm">
        Product
        <select
          name="product_id"
          required
          defaultValue={availability?.product_id}
          disabled={Boolean(availability)}
          className="input mt-1 w-full"
        >
          <option value="">Select…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Available date
        <input
          type="date"
          name="available_date"
          required
          defaultValue={availability?.available_date ?? todayFarmDate()}
          className="input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        Status
        <select
          name="status"
          defaultValue={availability?.status ?? "available"}
          className="input mt-1 w-full"
        >
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="sold_out">Sold out</option>
          <option value="hidden">Hidden</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Price per bunch ($)
          <input
            type="number"
            name="bunch_price"
            min={0}
            step="0.01"
            required
            defaultValue={availability?.bunch_price ?? 12}
            className="input mt-1 w-full"
          />
        </label>
        <label className="block text-sm">
          Stems per bunch
          <input
            type="number"
            name="stems_per_bunch"
            min={1}
            required
            defaultValue={availability?.stems_per_bunch ?? 10}
            className="input mt-1 w-full"
          />
        </label>
      </div>
      <label className="block text-sm">
        Bunches available
        <input
          type="number"
          name="bunches_available"
          min={0}
          required
          defaultValue={availability?.bunches_available ?? 0}
          className="input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        Harvest date
        <input
          type="date"
          name="harvest_date"
          defaultValue={availability?.harvest_date ?? todayFarmDate()}
          className="input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        Notes
        <textarea
          name="notes"
          rows={2}
          defaultValue={availability?.notes ?? ""}
          className="input mt-1 w-full resize-y"
        />
      </label>
      <label className="block text-sm">
        Display order
        <input
          type="number"
          name="display_order"
          defaultValue={availability?.display_order ?? 100}
          className="input mt-1 w-full"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="show_on_website"
          defaultChecked={availability?.show_on_website !== false}
          className="rounded-sm border-parchment"
        />
        Show on website
      </label>

      {error && <p className="text-sm text-bark">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn border-bark bg-bark text-white disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save listing"}
      </button>
    </form>
  );
}
