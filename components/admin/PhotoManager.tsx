"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { FarmProductPhoto } from "@/lib/inventory/types";

type PhotoManagerProps = {
  productId: string;
  availabilityId?: string | null;
};

export function PhotoManager({ productId, availabilityId = null }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<FarmProductPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const query = availabilityId
    ? `product_id=${productId}&availability_id=${availabilityId}`
    : `product_id=${productId}`;

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/photos?${query}`);
    const data = await res.json();
    const list = (data.photos ?? []) as FarmProductPhoto[];
    setPhotos(
      availabilityId
        ? list.filter((p) => p.availability_id === availabilityId)
        : list.filter((p) => !p.availability_id),
    );
  }, [query, availabilityId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("product_id", productId);

    const uploadRes = await fetch("/api/admin/photos/upload", {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      setMessage(uploadData.error ?? "Upload failed.");
      setUploading(false);
      return;
    }

    const createRes = await fetch("/api/admin/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        availability_id: availabilityId,
        image_url: uploadData.imageUrl,
        is_primary: photos.length === 0,
        alt_text: file.name.replace(/\.[^.]+$/, ""),
      }),
    });

    setUploading(false);

    if (!createRes.ok) {
      const data = await createRes.json();
      setMessage(data.error ?? "Could not save photo record.");
      return;
    }

    await load();
    e.target.value = "";
  }

  async function setPrimary(id: string) {
    await fetch(`/api/admin/photos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_primary: true }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this photo?")) return;
    await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-bark">Upload image</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={onUpload}
          className="mt-2 block w-full text-sm"
        />
      </label>

      {message && <p className="text-sm text-bark">{message}</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {photos.map((photo) => (
          <li
            key={photo.id}
            className="border border-parchment bg-white p-3"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
              <Image
                src={photo.image_url}
                alt={photo.alt_text ?? ""}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <p className="mt-2 truncate text-xs text-stone">
              {photo.is_primary ? "Primary" : "Secondary"}
            </p>
            <div className="mt-2 flex gap-2 text-xs">
              {!photo.is_primary && (
                <button
                  type="button"
                  onClick={() => setPrimary(photo.id)}
                  className="text-salmon-dark underline"
                >
                  Set primary
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(photo.id)}
                className="text-stone underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
