"use client";

import Image from "next/image";
import { focalObjectPosition } from "@/lib/site-cms/focal";

type FocalPointControlProps = {
  imageUrl: string;
  alt: string;
  focalX: number;
  focalY: number;
  aspectClass?: string;
  onChange: (focalX: number, focalY: number) => void;
  onSave: () => void;
  saving?: boolean;
};

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function FocalPointControl({
  imageUrl,
  alt,
  focalX,
  focalY,
  aspectClass = "aspect-[16/10]",
  onChange,
  onSave,
  saving = false,
}: FocalPointControlProps) {
  if (!imageUrl) return null;

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs font-medium text-bark">Image framing</p>
      <div
        className={`relative max-w-lg overflow-hidden bg-parchment ${aspectClass}`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          onChange(Math.round(x), Math.round(y));
        }}
        role="presentation"
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="cursor-crosshair object-cover"
          style={{ objectPosition: focalObjectPosition(focalX, focalY) }}
          sizes="512px"
          unoptimized={isRemoteSrc(imageUrl)}
        />
        <span
          className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-salmon shadow-sm"
          style={{ left: `${focalX}%`, top: `${focalY}%` }}
          aria-hidden
        />
      </div>
      <p className="text-xs text-stone">
        Click the preview to set the focal point, or use the sliders.
      </p>
      <div className="grid max-w-lg gap-3 sm:grid-cols-2">
        <label className="text-xs text-stone">
          Horizontal ({focalX}%)
          <input
            type="range"
            min={0}
            max={100}
            value={focalX}
            className="mt-1 block w-full"
            onChange={(e) => onChange(Number(e.target.value), focalY)}
          />
        </label>
        <label className="text-xs text-stone">
          Vertical ({focalY}%)
          <input
            type="range"
            min={0}
            max={100}
            value={focalY}
            className="mt-1 block w-full"
            onChange={(e) => onChange(focalX, Number(e.target.value))}
          />
        </label>
      </div>
      <button
        type="button"
        className="btn btn-secondary text-sm"
        disabled={saving}
        onClick={onSave}
      >
        {saving ? "Saving…" : "Save framing"}
      </button>
    </div>
  );
}
