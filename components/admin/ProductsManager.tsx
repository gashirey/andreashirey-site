"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FarmProduct } from "@/lib/inventory/types";

type Filter = "all" | "active" | "inactive";

export function ProductsManager() {
  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    const data = (await res.json()) as {
      products?: FarmProduct[];
      error?: string;
      code?: string;
    };

    if (!res.ok || data.error) {
      setLoadError(
        data.error ??
          "Could not load products. Run migrations 004/005 in Supabase SQL Editor.",
      );
      setProducts([]);
    } else {
      setLoadError("");
      setProducts(data.products ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = products.filter((p) => {
    if (filter === "active") return p.is_active;
    if (filter === "inactive") return !p.is_active;
    return true;
  });

  const activeCount = products.filter((p) => p.is_active).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-bark">Products</h1>
          <p className="mt-1 text-sm text-stone">
            {loading
              ? "Loading…"
              : `${products.length} total · ${activeCount} active in catalog`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn border-bark text-bark">
          Add product
        </Link>
      </div>

      {!loadError && !loading ? (
        <div className="mb-6 border border-parchment bg-sage-light/40 p-4 text-sm text-stone">
          <p>
            Active products do not appear on the public site until you{" "}
            <Link href="/admin/availability" className="text-bark underline">
              list them for today&apos;s date
            </Link>
            .
          </p>
        </div>
      ) : null}

      {loadError ? (
        <div className="mb-6 border border-parchment bg-white p-4 text-sm text-stone">
          <p className="font-medium text-bark">Products not available</p>
          <p className="mt-2">{loadError}</p>
          <p className="mt-2 text-xs">
            Run{" "}
            <code className="text-bark">005_farm_inventory_repair.sql</code> in
            Supabase, then refresh.
          </p>
        </div>
      ) : null}

      {!loading && !loadError && products.length === 0 ? (
        <p className="text-sm text-stone">
          No products yet.{" "}
          <Link href="/admin/products/new" className="underline">
            Add your first product
          </Link>
          .
        </p>
      ) : null}

      {!loadError && products.length > 0 ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2 text-sm">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-sm border px-3 py-1 capitalize ${
                  filter === f
                    ? "border-bark bg-bark text-cream"
                    : "border-parchment bg-white text-bark hover:border-bark/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <ul className="divide-y divide-parchment border border-parchment bg-white">
            {filtered.map((p) => (
              <ProductRow key={p.id} product={p} onUpdated={load} />
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="mt-4 text-sm text-stone">No products in this filter.</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function ProductRow({
  product,
  onUpdated,
}: {
  product: FarmProduct;
  onUpdated: () => void;
}) {
  const [active, setActive] = useState(product.is_active);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const dirty =
    active !== product.is_active ||
    name !== product.name ||
    description !== (product.description ?? "");

  async function patch(fields: Partial<FarmProduct>) {
    setStatus("saving");
    setMessage("");
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Save failed.");
      return;
    }
    setStatus("saved");
    setMessage("Saved");
    onUpdated();
    window.setTimeout(() => setStatus("idle"), 2000);
  }

  async function onActiveChange(checked: boolean) {
    const prev = active;
    setActive(checked);
    setStatus("saving");
    setMessage("");
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: checked }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setActive(prev);
      setStatus("error");
      setMessage(data.error ?? "Could not update status.");
      return;
    }
    setStatus("saved");
    setMessage(checked ? "Marked active" : "Marked inactive");
    onUpdated();
    window.setTimeout(() => setStatus("idle"), 2000);
  }

  async function saveFields() {
    await patch({
      name: name.trim(),
      description: description.trim() || null,
      is_active: active,
    });
  }

  return (
    <li className="px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <label className="flex shrink-0 items-center gap-2 pt-1 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => void onActiveChange(e.target.checked)}
            className="rounded-sm border-parchment"
          />
          <span className={active ? "text-bark" : "text-stone"}>
            {active ? "Active" : "Inactive"}
          </span>
        </label>
        <div className="flex shrink-0 gap-3 text-sm">
          <button
            type="button"
            disabled={!dirty || status === "saving"}
            onClick={() => void saveFields()}
            className="text-salmon-dark underline underline-offset-2 disabled:opacity-40"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {active ? (
            <Link
              href="/admin/availability"
              className="text-salmon-dark underline underline-offset-2"
            >
              List for today
            </Link>
          ) : null}
          <Link
            href={`/admin/products/${product.id}`}
            className="text-stone underline underline-offset-2 hover:text-bark"
          >
            Photos & details
          </Link>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <label className="block text-sm">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input mt-1 w-full"
          />
        </label>
        <p className="text-xs text-stone lg:pt-7">
          {product.category}
          {product.slug ? ` · ${product.slug}` : ""}
        </p>
      </div>

      <label className="mt-3 block text-sm">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="input mt-1 w-full resize-y text-sm"
        />
      </label>

      {message ? (
        <p
          className={`mt-2 text-xs ${status === "error" ? "text-bark" : "text-stone"}`}
        >
          {message}
        </p>
      ) : null}
    </li>
  );
}
