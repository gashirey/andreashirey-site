"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  SITE_MEDIA_SLOT_LABELS,
  SITE_MEDIA_SLOTS,
  type SiteMediaSlot,
  type SiteMediaSlotKey,
} from "@/lib/site-media/slots";

type HeroSlideRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
};

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

type SiteSlotsOverviewProps = {
  refreshKey?: number;
};

export function SiteSlotsOverview({ refreshKey = 0 }: SiteSlotsOverviewProps) {
  const [slots, setSlots] = useState<SiteMediaSlot[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [clearingHero, setClearingHero] = useState(false);
  const [clearingSlot, setClearingSlot] = useState<SiteMediaSlotKey | null>(
    null,
  );

  const load = useCallback(async () => {
    const [slotsRes, slidesRes] = await Promise.all([
      fetch("/api/admin/site-media"),
      fetch("/api/admin/hero-slides"),
    ]);

    const slotsData = await slotsRes.json();
    const slidesData = await slidesRes.json();

    if (!slotsRes.ok) {
      setLoadError(slotsData.error ?? "Could not load site slots.");
      return;
    }

    setSlots((slotsData.slots ?? []) as SiteMediaSlot[]);
    setHeroSlides(
      slidesRes.ok ? ((slidesData.slides ?? []) as HeroSlideRow[]) : [],
    );
    setLoadError("");
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function removeHeroSlide(id: string) {
    const res = await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  async function clearAllHeroSlides() {
    if (
      !window.confirm(
        "Remove every image from the homepage hero slideshow? The homepage will show text only until you add new slides.",
      )
    ) {
      return;
    }

    setClearingHero(true);
    const res = await fetch("/api/admin/hero-slides", { method: "DELETE" });
    setClearingHero(false);
    if (res.ok) await load();
  }

  async function clearSlot(slotKey: SiteMediaSlotKey) {
    const label = SITE_MEDIA_SLOT_LABELS[slotKey];
    if (
      !window.confirm(
        `Remove the current image from “${label}”? Visitors will not see a photo there until you assign a new one.`,
      )
    ) {
      return;
    }

    setClearingSlot(slotKey);
    const res = await fetch(
      `/api/admin/site-media?slot_key=${encodeURIComponent(slotKey)}`,
      { method: "DELETE" },
    );
    setClearingSlot(null);
    if (res.ok) await load();
  }

  const byKey = new Map(slots.map((s) => [s.slot_key, s]));
  const managedSlots: SiteMediaSlotKey[] = ["about", "contact"];
  const legacySlots = SITE_MEDIA_SLOTS.filter((k) => !managedSlots.includes(k));

  return (
    <section className="border border-parchment bg-white p-5">
      <h2 className="font-serif text-lg text-bark">Currently on the site</h2>
      <p className="mt-1 text-sm text-stone">
        Clear a placement here without hunting through the media library. Assign
        replacements below.
      </p>

      {loadError ? (
        <p className="mt-3 text-sm text-stone">{loadError}</p>
      ) : (
        <>
          <div className="mt-5 space-y-4">
            {managedSlots.map((key) => {
              const row = byKey.get(key);
              const imageUrl = row?.image_url?.trim() || "";
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-start gap-4 border border-parchment bg-cream/40 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-bark">
                      {SITE_MEDIA_SLOT_LABELS[key]}
                    </p>
                    {imageUrl ? (
                      <div className="relative mt-2 aspect-[4/5] w-full max-w-[120px] overflow-hidden bg-parchment">
                        <Image
                          src={imageUrl}
                          alt={row?.alt_text ?? key}
                          fill
                          className="object-cover"
                          sizes="120px"
                          unoptimized={isRemoteSrc(imageUrl)}
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-stone">No photo assigned</p>
                    )}
                  </div>
                  {imageUrl ? (
                    <button
                      type="button"
                      disabled={clearingSlot === key}
                      onClick={() => void clearSlot(key)}
                      className="btn shrink-0 border-parchment bg-white text-bark hover:border-bark disabled:opacity-50"
                    >
                      {clearingSlot === key ? "Removing…" : "Remove photo"}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>

          {legacySlots.some((key) => byKey.get(key)?.image_url?.trim()) ? (
            <div className="mt-5 border-t border-parchment pt-4">
              <p className="text-xs font-medium text-bark">Other placements</p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {legacySlots.map((key) => {
                  const row = byKey.get(key);
                  const imageUrl = row?.image_url?.trim() || "";
                  if (!imageUrl) return null;
                  return (
                    <li key={key} className="w-[110px]">
                      <p className="text-[10px] text-stone">
                        {SITE_MEDIA_SLOT_LABELS[key]}
                      </p>
                      <div className="relative mt-1 aspect-[4/3] overflow-hidden bg-parchment">
                        <Image
                          src={imageUrl}
                          alt={row?.alt_text ?? key}
                          fill
                          className="object-cover"
                          sizes="110px"
                          unoptimized={isRemoteSrc(imageUrl)}
                        />
                      </div>
                      <button
                        type="button"
                        disabled={clearingSlot === key}
                        onClick={() => void clearSlot(key)}
                        className="mt-1 block w-full text-center text-[10px] text-stone underline hover:text-bark disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 border-t border-parchment pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-bark">
                  Hero slideshow ({heroSlides.length} image
                  {heroSlides.length === 1 ? "" : "s"})
                </p>
                <p className="mt-1 text-xs text-stone max-w-md">
                  Homepage hero. Add via &ldquo;Add to hero slideshow&rdquo;
                  below.
                </p>
              </div>
              {heroSlides.length > 0 ? (
                <button
                  type="button"
                  disabled={clearingHero}
                  onClick={() => void clearAllHeroSlides()}
                  className="btn shrink-0 border-parchment bg-white text-bark hover:border-bark disabled:opacity-50"
                >
                  {clearingHero ? "Clearing…" : "Clear all hero images"}
                </button>
              ) : null}
            </div>
            {heroSlides.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {heroSlides.map((slide) => (
                  <li key={slide.id} className="relative">
                    <div className="relative h-16 w-24 overflow-hidden bg-parchment">
                      <Image
                        src={slide.image_url}
                        alt={slide.alt_text ?? ""}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized={isRemoteSrc(slide.image_url)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeHeroSlide(slide.id)}
                      className="mt-1 block w-full text-center text-[10px] text-stone underline hover:text-bark"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-stone">No slideshow images yet.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
