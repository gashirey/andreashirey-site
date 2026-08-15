"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type SiteMediaSlotKey } from "@/lib/site-media/slots";
import {
  compressImageBeforeUpload,
  formatBytes,
} from "@/lib/admin/client-compress-image";
import { readAdminUploadError } from "@/lib/admin/upload-response";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { ClientGalleriesOverview } from "@/components/admin/ClientGalleriesOverview";
import { ClientGalleryShare } from "@/components/admin/ClientGalleryShare";
import { PortfolioGalleryPanel } from "@/components/admin/PortfolioGalleryPanel";
import { SaveToPhotosButton } from "@/components/admin/SaveToPhotosButton";
import { SiteSlotsOverview } from "@/components/admin/SiteSlotsOverview";
import type { MediaAsset } from "@/lib/media/types";
import type { MediaShootSummary } from "@/lib/media/shoot-summary";
import type { FarmProduct } from "@/lib/inventory/types";

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

const BATCH_SIZE = 8;

const TABS = [
  { id: "shoots", label: "Shoots" },
  { id: "clients", label: "Client galleries" },
  { id: "work", label: "Work gallery" },
  { id: "site", label: "Site images" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function MediaLibrary() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<TabId>("shoots");
  const [shoots, setShoots] = useState<MediaShootSummary[]>([]);
  const [shootId, setShootId] = useState<string>("");
  const [newShootName, setNewShootName] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupError, setSetupError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [assetFilter, setAssetFilter] = useState<"all" | "gallery" | "library">(
    "all",
  );

  function showNotice(type: "success" | "error", text: string) {
    setNotice({ type, message: text });
    if (type === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const loadShoots = useCallback(async () => {
    const res = await fetch("/api/admin/media/shoots");
    const data = await res.json();
    if (!res.ok) {
      setSetupError(
        data.error ?? "Could not load shoots. Run migration 008 in Supabase.",
      );
      return false;
    }
    const list = (data.shoots ?? []) as MediaShootSummary[];
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
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        const pdata = await res.json();
        const all = (pdata.products ?? []) as FarmProduct[];
        setProducts(all.filter((p) => p.is_active));
      }
      setLoading(false);
    })();
  }, [loadShoots]);

  useEffect(() => {
    if (shootId) void loadAssets(shootId);
  }, [shootId, loadAssets]);

  const activeShoot = useMemo(
    () => shoots.find((shoot) => shoot.id === shootId) ?? null,
    [shoots, shootId],
  );

  const visibleAssets = useMemo(() => {
    if (assetFilter === "gallery") return assets.filter((a) => a.in_gallery);
    if (assetFilter === "library") return assets.filter((a) => !a.in_gallery);
    return assets;
  }, [assets, assetFilter]);

  const totals = useMemo(() => {
    return shoots.reduce(
      (acc, shoot) => {
        acc.photos += shoot.asset_count;
        acc.work += shoot.in_gallery_count;
        acc.clients += shoot.client_gallery_count;
        return acc;
      },
      { photos: 0, work: 0, clients: 0 },
    );
  }, [shoots]);

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
    setTab("shoots");
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
      const prepared: File[] = [];

      for (const file of batch) {
        setUploadProgress(
          `Optimizing ${done + prepared.length + 1} of ${files.length} (${formatBytes(file.size)})…`,
        );
        try {
          const { file: ready, compressed, originalBytes, outputBytes } =
            await compressImageBeforeUpload(file);
          if (compressed) {
            console.info(
              `[upload] ${file.name}: ${formatBytes(originalBytes)} → ${formatBytes(outputBytes)}`,
            );
          }
          prepared.push(ready);
        } catch {
          allErrors.push(`${file.name}: could not optimize in browser.`);
        }
      }

      if (!prepared.length) {
        done += batch.length;
        continue;
      }

      setUploadProgress(
        `Uploading ${done + 1}–${done + prepared.length} of ${files.length}…`,
      );

      const formData = new FormData();
      formData.append("shoot_id", shootId);
      for (const file of prepared) {
        formData.append("files", file);
      }

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      done += batch.length;

      if (!res.ok) {
        allErrors.push(await readAdminUploadError(res));
        continue;
      }

      const data = await res.json();
      const batchErrors = (data.errors ?? []) as {
        filename: string;
        error: string;
      }[];
      for (const err of batchErrors) {
        allErrors.push(`${err.filename}: ${err.error}`);
      }
    }

    setUploading(false);
    setUploadProgress("");
    await loadAssets(shootId);
    await loadShoots();
    setGalleryRefreshKey((k) => k + 1);

    if (allErrors.length) {
      showNotice(
        "error",
        `Upload issues: ${allErrors.slice(0, 3).join("; ")}${allErrors.length > 3 ? "…" : ""}`,
      );
    } else {
      showNotice(
        "success",
        `Uploaded ${files.length} image(s) to “${activeShoot?.name ?? "this shoot"}”.`,
      );
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
    target: "site_slot" | "product" | "hero_slide",
    slotOrProduct?: string,
  ) {
    setAssigningId(assetId);

    const body =
      target === "hero_slide"
        ? { asset_id: assetId, target: "hero_slide" as const }
        : target === "site_slot"
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

    try {
      const res = await fetch("/api/admin/media/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        showNotice("success", data.message ?? "Site updated.");
        setSlotsRefreshKey((k) => k + 1);
      } else {
        showNotice(
          "error",
          data.error ??
            "Assign failed. Check migrations 007 and 010 in Supabase.",
        );
      }
    } catch {
      showNotice("error", "Assign failed — network or server error.");
    } finally {
      setAssigningId(null);
    }
  }

  async function setInGallery(asset: MediaAsset, inGallery: boolean) {
    setRemovingId(asset.id);
    const res = await fetch(`/api/admin/media/assets/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_gallery: inGallery }),
    });
    setRemovingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showNotice("error", data.error ?? "Could not update gallery selection.");
      return;
    }

    const data = await res.json();
    const next = data.asset as MediaAsset;
    setAssets((prev) =>
      prev.map((a) => (a.id === asset.id ? { ...a, ...next } : a)),
    );
    setGalleryRefreshKey((k) => k + 1);
    void loadShoots();
  }

  async function deleteForever(asset: MediaAsset) {
    if (
      !window.confirm(
        `Permanently delete “${asset.filename}”? This cannot be undone. Prefer unchecking “In gallery” if you might use it later.`,
      )
    ) {
      return;
    }

    setRemovingId(asset.id);
    const res = await fetch(`/api/admin/media/assets/${asset.id}`, {
      method: "DELETE",
    });
    setRemovingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showNotice("error", data.error ?? "Could not delete image.");
      return;
    }

    showNotice("success", `Deleted ${asset.filename}.`);
    await loadAssets(shootId);
    await loadShoots();
    setGalleryRefreshKey((k) => k + 1);
    setSlotsRefreshKey((k) => k + 1);
  }

  function openShoot(id: string) {
    setShootId(id);
    setTab("shoots");
    setMessage("");
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
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <AdminNotice
          type={notice.type}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-parchment bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-stone">
            Shoots
          </p>
          <p className="mt-1 font-serif text-2xl text-bark">{shoots.length}</p>
          <p className="text-xs text-stone">{totals.photos} photos total</p>
        </div>
        <div className="border border-parchment bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-stone">
            Work gallery
          </p>
          <p className="mt-1 font-serif text-2xl text-bark">{totals.work}</p>
          <p className="text-xs text-stone">photos on /gallery</p>
        </div>
        <div className="border border-parchment bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-stone">
            Client galleries
          </p>
          <p className="mt-1 font-serif text-2xl text-bark">{totals.clients}</p>
          <p className="text-xs text-stone">share links created</p>
        </div>
      </div>

      <nav
        className="flex flex-wrap gap-2 border-b border-parchment"
        aria-label="Media sections"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`border-b-2 px-3 py-2 text-sm transition-colors ${
              tab === item.id
                ? "border-bark font-medium text-bark"
                : "border-transparent text-stone hover:text-bark"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {message ? (
        <p className="text-sm text-stone" role="status">
          {message}
        </p>
      ) : null}

      {tab === "clients" ? (
        <ClientGalleriesOverview onOpenShoot={openShoot} />
      ) : null}

      {tab === "work" ? (
        <div className="space-y-4">
          <p className="max-w-2xl text-sm text-stone">
            Choose which library photos appear on the public Work gallery.
            Uploads stay private until you check them here or on a shoot.
          </p>
          <PortfolioGalleryPanel
            refreshKey={galleryRefreshKey}
            onChanged={() => {
              setSlotsRefreshKey((k) => k + 1);
              if (shootId) void loadAssets(shootId);
              void loadShoots();
            }}
          />
        </div>
      ) : null}

      {tab === "site" ? (
        <div className="space-y-4">
          <p className="max-w-2xl text-sm text-stone">
            Homepage, About, and Contact placements. Assign images from a shoot
            under Shoots → Use on site.
          </p>
          <SiteSlotsOverview refreshKey={slotsRefreshKey} />
        </div>
      ) : null}

      {tab === "shoots" ? (
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="border border-parchment bg-white p-4">
              <h2 className="font-serif text-lg text-bark">Shoots</h2>
              <p className="mt-1 text-xs text-stone">
                Pick a shoot to upload, share with a client, or manage photos.
              </p>
              <form onSubmit={createShoot} className="mt-3 space-y-2">
                <input
                  type="text"
                  value={newShootName}
                  onChange={(e) => setNewShootName(e.target.value)}
                  placeholder="New shoot name"
                  className="input w-full text-sm"
                />
                <button
                  type="submit"
                  className="btn w-full border-bark bg-bark text-cream"
                >
                  Add shoot
                </button>
              </form>
            </section>

            <ul className="space-y-2">
              {shoots.map((shoot) => {
                const active = shoot.id === shootId;
                return (
                  <li key={shoot.id}>
                    <button
                      type="button"
                      onClick={() => openShoot(shoot.id)}
                      className={`w-full border px-3 py-3 text-left ${
                        active
                          ? "border-bark bg-bark text-cream"
                          : "border-parchment bg-white text-bark hover:border-bark"
                      }`}
                    >
                      <span className="block text-sm font-medium">
                        {shoot.name}
                      </span>
                      <span
                        className={`mt-1 block text-xs ${
                          active ? "text-cream/80" : "text-stone"
                        }`}
                      >
                        {shoot.asset_count} photo
                        {shoot.asset_count === 1 ? "" : "s"}
                        {" · "}
                        {shoot.in_gallery_count} on Work
                        {" · "}
                        {shoot.client_gallery_count} client link
                        {shoot.client_gallery_count === 1 ? "" : "s"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="space-y-6">
            {activeShoot ? (
              <div className="border border-parchment bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.12em] text-stone">
                  Active shoot
                </p>
                <h2 className="mt-1 font-serif text-2xl text-bark">
                  {activeShoot.name}
                </h2>
                <p className="mt-2 text-sm text-stone">
                  {activeShoot.asset_count} photos in library
                  {" · "}
                  {activeShoot.in_gallery_count} on public Work gallery
                  {" · "}
                  {activeShoot.client_gallery_count} client gallery link
                  {activeShoot.client_gallery_count === 1 ? "" : "s"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-stone">
                Create a shoot to start uploading.
              </p>
            )}

            <ClientGalleryShare
              shootId={shootId}
              shootName={activeShoot?.name ?? "Session"}
              imageCount={assets.length}
            />

            <section
              className={`border border-dashed p-8 text-center transition-colors ${
                dragOver
                  ? "border-salmon bg-salmon-light/30"
                  : "border-parchment bg-white"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <p className="font-medium text-bark">Upload to this shoot</p>
              <p className="mt-1 text-sm text-stone">
                Photos stay in the library until you add them to the Work
                gallery or share a client link.
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
              {uploadProgress ? (
                <p className="mt-3 text-sm text-stone">{uploadProgress}</p>
              ) : null}
            </section>

            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg text-bark">
                    Photos in this shoot
                    {assets.length ? ` (${assets.length})` : ""}
                  </h3>
                  <p className="mt-1 text-sm text-stone">
                    Check = on Work gallery. Client galleries include all photos
                    in the shoot.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(
                    [
                      ["all", "All"],
                      ["gallery", "On Work"],
                      ["library", "Library only"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAssetFilter(id)}
                      className={`border px-3 py-1.5 ${
                        assetFilter === id
                          ? "border-bark bg-bark text-cream"
                          : "border-parchment bg-white text-stone"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-2 text-sm text-stone">
                Phone workflow:{" "}
                <a href="/admin/social" className="underline hover:text-bark">
                  Social
                </a>
                . Orders:{" "}
                <a href="/admin/orders" className="underline hover:text-bark">
                  Orders
                </a>
                .
              </p>

              {assets.length === 0 ? (
                <p className="mt-6 text-sm text-stone">
                  No images in this shoot yet.
                </p>
              ) : visibleAssets.length === 0 ? (
                <p className="mt-6 text-sm text-stone">
                  No photos match this filter.
                </p>
              ) : (
                <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleAssets.map((asset) => (
                    <li
                      key={asset.id}
                      className={`relative border bg-white p-2 sm:p-3 ${
                        asset.in_gallery
                          ? "border-bark"
                          : "border-parchment"
                      }`}
                    >
                      <label className="absolute right-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center border border-parchment bg-white">
                        <span className="sr-only">In Work gallery</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-bark"
                          checked={Boolean(asset.in_gallery)}
                          disabled={removingId === asset.id}
                          onChange={(e) =>
                            void setInGallery(asset, e.target.checked)
                          }
                        />
                      </label>
                      <div className="relative aspect-square overflow-hidden bg-parchment sm:aspect-[4/3]">
                        <Image
                          src={asset.public_url}
                          alt={asset.alt_text ?? asset.filename}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 240px"
                          unoptimized={isRemoteSrc(asset.public_url)}
                        />
                      </div>
                      <p className="mt-2 truncate text-xs text-stone">
                        {asset.filename}
                      </p>
                      <p className="text-[10px] text-stone">
                        {asset.in_gallery ? "In Work gallery" : "Library only"}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        <a
                          href={asset.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn border-parchment py-2 text-center text-xs"
                        >
                          Open
                        </a>
                        <button
                          type="button"
                          disabled={removingId === asset.id}
                          onClick={() => void deleteForever(asset)}
                          className="btn border-parchment py-2 text-xs text-stone disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="mt-2">
                        <SaveToPhotosButton
                          downloadUrl={`/api/admin/social/download?kind=media&id=${asset.id}`}
                          filename={asset.filename}
                          onResult={(r) => {
                            if (r.ok) setMessage(r.message);
                            else if (r.message !== "Cancelled.") {
                              setMessage(r.message);
                            }
                          }}
                        />
                      </div>
                      <label className="mt-2 block text-xs">
                        Use on site
                        <select
                          className="input mt-1 w-full text-base disabled:opacity-50 sm:text-xs"
                          disabled={assigningId === asset.id}
                          value=""
                          onChange={(e) => {
                            const v = e.target.value;
                            if (!v || assigningId) return;
                            if (v === "hero_slide") {
                              void assign(asset.id, "hero_slide");
                            } else if (v.startsWith("slot:")) {
                              void assign(
                                asset.id,
                                "site_slot",
                                v.slice("slot:".length) as SiteMediaSlotKey,
                              );
                            } else if (v.startsWith("product:")) {
                              void assign(
                                asset.id,
                                "product",
                                v.slice("product:".length),
                              );
                            }
                          }}
                        >
                          <option value="">Choose…</option>
                          <optgroup label="Site">
                            <option value="hero_slide">
                              Add to hero slideshow
                            </option>
                            <option value="slot:about">
                              Set as About page photo
                            </option>
                            <option value="slot:contact">
                              Set as Contact page photo
                            </option>
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
        </div>
      ) : null}
    </div>
  );
}
