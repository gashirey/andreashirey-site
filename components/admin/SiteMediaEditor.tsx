"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { compressImageBeforeUpload } from "@/lib/admin/client-compress-image";
import { readAdminUploadError } from "@/lib/admin/upload-response";
import {
  SITE_MEDIA_SLOT_LABELS,
  SITE_MEDIA_SLOTS,
  type SiteMediaSlot,
  type SiteMediaSlotKey,
} from "@/lib/site-media/slots";

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function SiteMediaEditor() {
  const [slots, setSlots] = useState<SiteMediaSlot[]>([]);
  const [uploading, setUploading] = useState<SiteMediaSlotKey | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/site-media");
    const data = await res.json();
    setSlots((data.slots ?? []) as SiteMediaSlot[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(slotKey: SiteMediaSlotKey, file: File) {
    setUploading(slotKey);
    setMessage("Optimizing…");

    let ready: File;
    try {
      ({ file: ready } = await compressImageBeforeUpload(file));
    } catch {
      setUploading(null);
      setMessage("Could not optimize image in browser.");
      return;
    }

    setMessage("Uploading…");
    const formData = new FormData();
    formData.append("file", ready);
    formData.append("slot_key", slotKey);
    const slot = slots.find((s) => s.slot_key === slotKey);
    if (slot?.alt_text) formData.append("alt_text", slot.alt_text);

    const res = await fetch("/api/admin/site-media/upload", {
      method: "POST",
      body: formData,
    });
    setUploading(null);

    if (!res.ok) {
      setMessage(await readAdminUploadError(res));
      return;
    }

    setMessage(`Updated ${SITE_MEDIA_SLOT_LABELS[slotKey]}.`);
    await load();
  }

  async function saveAlt(slotKey: SiteMediaSlotKey, alt_text: string) {
    const slot = slots.find((s) => s.slot_key === slotKey);
    if (!slot) return;

    await fetch("/api/admin/site-media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slot_key: slotKey,
        image_url: slot.image_url,
        alt_text,
      }),
    });
    await load();
  }

  const byKey = new Map(slots.map((s) => [s.slot_key, s]));

  return (
    <div className="space-y-10">
      {message && <p className="text-sm text-bark">{message}</p>}

      {SITE_MEDIA_SLOTS.map((slotKey) => {
        const slot = byKey.get(slotKey);
        const imageUrl = slot?.image_url ?? "";
        const alt = slot?.alt_text ?? "";

        return (
          <section
            key={slotKey}
            className="border border-parchment bg-white p-5"
          >
            <h2 className="font-serif text-lg text-bark">
              {SITE_MEDIA_SLOT_LABELS[slotKey]}
            </h2>
            <p className="mt-1 text-xs text-stone">Slot: {slotKey}</p>

            {imageUrl ? (
              <div className="relative mt-4 aspect-[16/10] max-w-lg overflow-hidden bg-parchment">
                <Image
                  src={imageUrl}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="512px"
                  unoptimized={isRemoteSrc(imageUrl)}
                />
              </div>
            ) : null}

            <label className="mt-4 block text-sm">
              <span className="font-medium text-bark">Replace image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={uploading === slotKey}
                className="mt-2 block w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(slotKey, file);
                  e.target.value = "";
                }}
              />
            </label>

            <label className="mt-4 block text-sm">
              Alt text
              <input
                type="text"
                defaultValue={alt}
                key={`${slotKey}-${alt}`}
                className="input mt-1 w-full max-w-lg"
                onBlur={(e) => {
                  if (e.target.value !== alt) {
                    void saveAlt(slotKey, e.target.value);
                  }
                }}
              />
            </label>
          </section>
        );
      })}
    </div>
  );
}
