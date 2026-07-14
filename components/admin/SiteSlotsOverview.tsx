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

function SlotThumb({
  label,
  imageUrl,
  alt,
  emptyText,
}: {
  label: string;
  imageUrl: string | null;
  alt: string;
  emptyText: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-bark">{label}</p>
      {imageUrl ? (
        <div className="relative mt-2 aspect-[4/3] w-full max-w-[140px] overflow-hidden bg-parchment">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="140px"
            unoptimized={isRemoteSrc(imageUrl)}
          />
        </div>
      ) : (
        <p className="mt-2 text-xs text-stone">{emptyText}</p>
      )}
    </div>
  );
}

type SiteSlotsOverviewProps = {
  refreshKey?: number;
};

export function SiteSlotsOverview({ refreshKey = 0 }: SiteSlotsOverviewProps) {
  const [slots, setSlots] = useState<SiteMediaSlot[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [clearingHero, setClearingHero] = useState(false);

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

  const byKey = new Map(slots.map((s) => [s.slot_key, s]));

  return (
    <section className="border border-parchment bg-white p-5">
      <h2 className="font-serif text-lg text-bark">Currently on the site</h2>
      <p className="mt-1 text-sm text-stone">
        What visitors see now. Assign below to change a slot.
      </p>

      {loadError ? (
        <p className="mt-3 text-sm text-stone">{loadError}</p>
      ) : (
        <>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {SITE_MEDIA_SLOTS.map((key) => {
              const row = byKey.get(key);
              return (
                <SlotThumb
                  key={key}
                  label={SITE_MEDIA_SLOT_LABELS[key as SiteMediaSlotKey]}
                  imageUrl={row?.image_url ?? null}
                  alt={row?.alt_text ?? key}
                  emptyText="Not set"
                />
              );
            })}
          </div>

          <div className="mt-6 border-t border-parchment pt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-bark">
                  Hero slideshow ({heroSlides.length} image
                  {heroSlides.length === 1 ? "" : "s"})
                </p>
                <p className="mt-1 text-xs text-stone max-w-md">
                  This is the homepage hero. Add images via &ldquo;Add to hero
                  slideshow&rdquo; below. Two or more slides crossfade; zero
                  slides shows a text-only hero.
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
