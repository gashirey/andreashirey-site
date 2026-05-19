"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SITE_MEDIA_SLOT_LABELS,
  SITE_MEDIA_SLOTS,
  type SiteMediaSlotKey,
} from "@/lib/site-media/slots";
import type { MediaAsset, MediaShoot } from "@/lib/media/types";
import type { FarmProduct } from "@/lib/inventory/types";

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

const BATCH_SIZE = 8;

export function MediaLibrary() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [shoots, setShoots] = useState<MediaShoot[]>([]);
  const [shootId, setShootId] = useState<string>("");
  const [newShootName, setNewShootName] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupError, setSetupError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const loadShoots = useCallback(async () => {
    const res = await fetch("/api/admin/media/shoots");
    const data = await res.json();
    if (!res.ok) {
      setSetupError(data.error ?? "Could not load shoots. Run migration 008 in Supabase.");
      return false;
    }
    const list = (data.shoots ?? []) as MediaShoot[];
    setShoots(list);
    setShootId((prev) => prev || list[0]?.id || "");
    setSetupError("");
    return true;
  }, []);

  const loadAssets = useCallback(async (id: string) => {
    if (!id) {
      setAssets([]);
      return;
    }
    const res = await fetch(`/api/admin/media/assets?shoot_id=${id}`);
    const data = await res.json();
    if (!res.ok) {
      setSetupError(data.error ?? "Could not load library.");
      return;
    }
    setAssets((data.assets ?? []) as MediaAsset[]);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ok = await loadShoots();
      if (ok) {
        const res = await fetch("/api/admin/products");
        const pdata = await res.json();
        setProducts((pdata.products ?? []) as FarmProduct[]);
      }
      setLoading(false);
    })();
  }, [loadShoots]);

  useEffect(() => {
    if (shootId) void loadAssets(shootId);
  }, [shootId, loadAssets]);

  async function createShoot(e: React.FormEvent) {
    e.preventDefault();
    const name = newShootName.trim();
    if (!name) return;

    const res = await fetch("/api/admin/media/shoots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Could not create shoot.");
      return;
    }

    setNewShootName("");
    await loadShoots();
    setShootId(data.shoot.id);
    setMessage(`Created shoot “${name}”.`);
  }

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;
    if (!shootId) {
      setMessage("Select or create a shoot first.");
      return;
    }

    setUploading(true);
    setMessage("");
    let done = 0;
    const allErrors: string[] = [];

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      setUploadProgress(`Uploading ${done + 1}–${Math.min(done + batch.length, files.length)} of ${files.length}…`);

      const formData = new FormData();
      formData.append("shoot_id", shootId);
      for (const file of batch) {
        formData.append("files", file);
      }

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      done += batch.length;

      if (!res.ok) {
        allErrors.push(data.error ?? "Upload failed.");
        continue;
      }

      const batchErrors = (data.errors ?? []) as { filename: string; error: string }[];
      for (const err of batchErrors) {
        allErrors.push(`${err.filename}: ${err.error}`);
      }
    }

    setUploading(false);
    setUploadProgress("");
    await loadAssets(shootId);

    if (allErrors.length) {
      setMessage(`Finished with issues: ${allErrors.slice(0, 3).join("; ")}${allErrors.length > 3 ? "…" : ""}`);
    } else {
      setMessage(`Uploaded ${files.length} image(s).`);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      void uploadFiles(e.dataTransfer.files);
    }
  }

  async function assign(
    assetId: string,
    target: "site_slot" | "product",
    slotOrProduct: string,
  ) {
    setMessage("");
    const body =
      target === "site_slot"
        ? {
            asset_id: assetId,
            target: "site_slot" as const,
            slot_key: slotOrProduct,
          }
        : {
            asset_id: assetId,
            target: "product" as const,
            product_id: slotOrProduct,
            is_primary: true,
          };

    const res = await fetch("/api/admin/media/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setMessage(res.ok ? (data.message as string) : (data.error ?? "Assign failed."));
  }

  if (loading) {
    return <p className="text-sm text-stone">Loading library…</p>;
  }

  if (setupError) {
    return (
      <div className="border border-parchment bg-white p-5 text-sm">
        <p className="font-medium text-bark">Media library not ready</p>
        <p className="mt-2 text-stone">{setupError}</p>
        <p className="mt-3 text-stone">
          In Supabase SQL Editor, run{" "}
          <code className="text-bark">supabase/migrations/008_media_library.sql</code>
          {". "}
          If you use site slots, also run{" "}
          <code className="text-bark">007_site_media_slots.sql</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {message && <p className="text-sm text-bark">{message}</p>}

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">Shoot</h2>
        <p className="mt-1 text-sm text-stone">
          Group uploads (e.g. “May 2026 shoot”). Edited photos can go in a new shoot later.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            Active shoot
            <select
              value={shootId}
              onChange={(e) => setShootId(e.target.value)}
              className="input mt-1 block min-w-[12rem]"
            >
              {shoots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <form onSubmit={createShoot} className="flex flex-wrap items-end gap-2">
            <label className="text-sm">
              New shoot
              <input
                type="text"
                value={newShootName}
                onChange={(e) => setNewShootName(e.target.value)}
                placeholder="May 2026"
                className="input mt-1 block w-40"
              />
            </label>
            <button type="submit" className="btn border-bark bg-bark text-cream">
              Add
            </button>
          </form>
        </div>
      </section>

      <section
        className={`border border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-salmon bg-salmon-light/30" : "border-parchment bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <p className="font-medium text-bark">Drop images here</p>
        <p className="mt-1 text-sm text-stone">
          JPEG, PNG, or WebP — up to 50 files at a time, 15MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={uploading || !shootId}
          onClick={() => inputRef.current?.click()}
          className="btn mt-4 border-bark bg-bark text-cream disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Choose files"}
        </button>
        {uploadProgress && (
          <p className="mt-3 text-sm text-stone">{uploadProgress}</p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-lg text-bark">
          Library {assets.length ? `(${assets.length})` : ""}
        </h2>
        <p className="mt-1 text-sm text-stone">
          Use on site — assigns to homepage, about, or a product.
        </p>

        {assets.length === 0 ? (
          <p className="mt-6 text-sm text-stone">No images in this shoot yet.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <li
                key={asset.id}
                className="border border-parchment bg-white p-3"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
                  <Image
                    src={asset.public_url}
                    alt={asset.alt_text ?? asset.filename}
                    fill
                    className="object-cover"
                    sizes="240px"
                    unoptimized={isRemoteSrc(asset.public_url)}
                  />
                </div>
                <p className="mt-2 truncate text-xs text-stone">{asset.filename}</p>
                <label className="mt-2 block text-xs">
                  Use on site
                  <select
                    defaultValue=""
                    className="input mt-1 w-full text-xs"
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) return;
                      if (v.startsWith("slot:")) {
                        void assign(
                          asset.id,
                          "site_slot",
                          v.replace("slot:", "") as SiteMediaSlotKey,
                        );
                      } else if (v.startsWith("product:")) {
                        void assign(asset.id, "product", v.replace("product:", ""));
                      }
                      e.target.value = "";
                    }}
                  >
                    <option value="">Choose…</option>
                    <optgroup label="Site">
                      {SITE_MEDIA_SLOTS.map((key) => (
                        <option key={key} value={`slot:${key}`}>
                          {SITE_MEDIA_SLOT_LABELS[key]}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Products">
                      {products.map((p) => (
                        <option key={p.id} value={`product:${p.id}`}>
                          {p.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
