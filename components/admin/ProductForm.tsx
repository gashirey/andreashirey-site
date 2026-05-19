"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FarmProduct } from "@/lib/inventory/types";

type ProductFormProps = {
  product?: FarmProduct;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      slug: form.get("slug"),
      category: form.get("category"),
      description: form.get("description"),
      variety: form.get("variety"),
      color: form.get("color"),
      is_active: form.get("is_active") === "on",
    };

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PATCH" : "POST";

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

    router.push(`/admin/products/${data.product.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="block text-sm">
        Name
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        Slug
        <input
          name="slug"
          defaultValue={product?.slug}
          placeholder="auto-from-name"
          className="input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        Category
        <select
          name="category"
          defaultValue={product?.category ?? "flowers"}
          className="input mt-1 w-full"
        >
          <option value="flowers">Flowers</option>
          <option value="produce">Produce</option>
          <option value="eggs">Eggs</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className="block text-sm">
        Description
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="input mt-1 w-full resize-y"
        />
      </label>
      <label className="block text-sm">
        Variety
        <input
          name="variety"
          defaultValue={product?.variety ?? ""}
          className="input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        Color
        <input
          name="color"
          defaultValue={product?.color ?? ""}
          className="input mt-1 w-full"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={product?.is_active !== false}
          className="rounded-sm border-parchment"
        />
        Active
      </label>

      {error && <p className="text-sm text-bark">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn border-bark bg-bark text-white disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
