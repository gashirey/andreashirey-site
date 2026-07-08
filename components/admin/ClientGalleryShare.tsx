"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClientGallery } from "@/lib/client-gallery/types";

type ClientGalleryRow = ClientGallery & {
  share_path: string;
  share_url: string;
};

type ClientGalleryShareProps = {
  shootId: string;
  shootName: string;
  imageCount: number;
};

export function ClientGalleryShare({
  shootId,
  shootName,
  imageCount,
}: ClientGalleryShareProps) {
  const [galleries, setGalleries] = useState<ClientGalleryRow[]>([]);
  const [title, setTitle] = useState(shootName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadGalleries = useCallback(async () => {
    if (!shootId) {
      setGalleries([]);
      return;
    }

    const res = await fetch(`/api/admin/client-galleries?shoot_id=${shootId}`);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Could not load client galleries.");
      return;
    }

    setGalleries((data.galleries ?? []) as ClientGalleryRow[]);
    setMessage("");
  }, [shootId]);

  useEffect(() => {
    setTitle(shootName);
    void loadGalleries();
  }, [loadGalleries, shootName]);

  async function createGallery(e: React.FormEvent) {
    e.preventDefault();
    if (!shootId) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/client-galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shoot_id: shootId,
        title: title.trim() || shootName,
        is_published: true,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(
        data.error ??
          "Could not create gallery. Run migration 015 in Supabase.",
      );
      return;
    }

    await loadGalleries();
    setMessage("Client viewing link created.");
  }

  async function togglePublished(gallery: ClientGalleryRow) {
    const res = await fetch(`/api/admin/client-galleries/${gallery.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !gallery.is_published }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error ?? "Could not update gallery.");
      return;
    }

    await loadGalleries();
    setMessage(
      data.gallery.is_published
        ? "Gallery published — link is live."
        : "Gallery unpublished — link is disabled.",
    );
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied to clipboard.");
    } catch {
      setMessage("Could not copy link automatically.");
    }
  }

  return (
    <section className="border border-parchment bg-white p-5">
      <h2 className="font-serif text-lg text-bark">Client viewing</h2>
      <p className="mt-1 text-sm text-stone">
        Share a private gallery link with your client. They can browse and view
        photos full-size. Package selection comes next.
      </p>

      {!imageCount ? (
        <p className="mt-4 text-sm text-stone">
          Upload images to this shoot before creating a client link.
        </p>
      ) : (
        <form onSubmit={createGallery} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            Gallery title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input mt-1 block min-w-[14rem]"
              placeholder={shootName}
            />
          </label>
          <button
            type="submit"
            disabled={loading || !shootId}
            className="btn border-bark bg-bark text-cream disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create client link"}
          </button>
        </form>
      )}

      {message ? (
        <p className="mt-4 text-sm text-stone" role="status">
          {message}
        </p>
      ) : null}

      {galleries.length ? (
        <ul className="mt-6 space-y-3">
          {galleries.map((gallery) => (
            <li
              key={gallery.id}
              className="border border-parchment px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-bark">{gallery.title}</p>
                  <p className="mt-1 text-stone">
                    {gallery.is_published ? "Published" : "Unpublished"}
                    {" · "}
                    {imageCount} photo{imageCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyLink(gallery.share_url)}
                    className="btn border-parchment py-2 text-xs"
                  >
                    Copy link
                  </button>
                  <a
                    href={gallery.share_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-parchment py-2 text-xs"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => void togglePublished(gallery)}
                    className="btn border-parchment py-2 text-xs"
                  >
                    {gallery.is_published ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
              <p className="mt-2 break-all font-mono text-xs text-stone">
                {gallery.share_url}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
