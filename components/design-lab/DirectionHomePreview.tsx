"use client";

import Image from "next/image";
import Link from "next/link";
import type { DesignDirection } from "@/lib/design-lab/directions";
import { designDirections, labCopy } from "@/lib/design-lab/directions";
import { labPhotos } from "@/lib/design-lab/photos";
import { galleryImages } from "@/lib/content";

type DirectionHomePreviewProps = {
  direction: DesignDirection;
};

export function DirectionHomePreview({ direction }: DirectionHomePreviewProps) {
  const d = direction;
  const featured = galleryImages.slice(0, 2);

  const style = {
    "--lab-bg": d.colors.bg,
    "--lab-surface": d.colors.surface,
    "--lab-text": d.colors.text,
    "--lab-muted": d.colors.muted,
    "--lab-accent": d.colors.accent,
    "--lab-accent-hover": d.colors.accentHover,
    "--lab-green": d.colors.green,
    "--lab-green-muted": d.colors.greenMuted,
    "--lab-border": d.colors.border,
    "--lab-scrim": d.colors.scrim,
    "--lab-chip": d.colors.chip,
    "--lab-chip-text": d.colors.chipText,
    "--lab-serif": d.serifVar,
    "--lab-sans": d.sansVar,
    "--lab-section-y": d.spacing.sectionY,
    backgroundColor: d.colors.bg,
    color: d.colors.text,
    fontFamily: d.sansVar,
  } as React.CSSProperties;

  return (
    <div className="lab-home" style={style}>
      <div
        className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 text-xs"
        style={{
          borderColor: d.colors.border,
          backgroundColor: d.colors.surface,
          fontFamily: d.sansVar,
        }}
      >
        <span style={{ color: d.colors.muted }}>{d.name} · home preview</span>
        <nav className="flex flex-wrap items-center gap-3">
          {designDirections.map((dir) => (
            <Link
              key={dir.id}
              href={`/design-lab/${dir.id}`}
              className={dir.id === d.id ? "font-medium" : ""}
              style={{ color: dir.id === d.id ? d.colors.accent : d.colors.muted }}
            >
              {dir.id.toUpperCase()}
            </Link>
          ))}
          <Link href="/design-lab" style={{ color: d.colors.muted }}>
            Specimens
          </Link>
        </nav>
      </div>

      {d.hero === "split" && <HomeHeroSplit />}
      {d.hero === "immersive" && <HomeHeroImmersive />}
      {d.hero === "grounded" && <HomeHeroGrounded />}

      <HomeSection eyebrow="Welcome" title="Flowers grown slowly, shared seasonally">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden" style={{ background: d.colors.border }}>
            <Image src={labPhotos.feature.src} alt={labPhotos.feature.alt} fill className="object-cover" sizes="50vw" />
          </div>
          <div className="space-y-5" style={{ color: d.colors.muted }}>
            <p className="leading-relaxed">
              We cultivate thoughtful blooms for everyday joy, intimate gatherings,
              and milestone celebrations — gathered fresh from our Louisa fields.
            </p>
            <p className="leading-relaxed">
              Quiet beauty for the kitchen table, the garden path, and your wedding day.
            </p>
            <a href="#" className="lab-btn-outline" onClick={(e) => e.preventDefault()}>
              Our story
            </a>
          </div>
        </div>
      </HomeSection>

      <HomeSection eyebrow="Work" title="Selected photographs" surface>
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden border"
              style={{ borderColor: d.colors.border, background: d.colors.surface }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              {item.caption ? (
                <p
                  className="border-t p-4 text-sm"
                  style={{ borderColor: d.colors.border, color: d.colors.muted }}
                >
                  {item.caption}
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#" className="lab-btn-primary" onClick={(e) => e.preventDefault()}>
            View work
          </a>
          <a href="#" className="lab-btn-outline" onClick={(e) => e.preventDefault()}>
            Inquire about flowers
          </a>
        </div>
      </HomeSection>

      <HomeSection surface>
        <div
          className="border px-8 py-12 text-center md:px-12"
          style={{ borderColor: d.colors.border, background: d.colors.surface }}
        >
          <h2
            className="text-2xl md:text-3xl"
            style={{ fontFamily: d.serifVar, color: d.colors.text }}
          >
            Planning a wedding or special event?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed" style={{ color: d.colors.muted }}>
            Seasonally inspired florals for intimate gatherings and milestone celebrations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#" className="lab-btn-primary" onClick={(e) => e.preventDefault()}>
              Weddings & events
            </a>
            <a href="#" className="lab-btn-ghost" onClick={(e) => e.preventDefault()}>
              Inquire about flowers
            </a>
          </div>
        </div>
      </HomeSection>
    </div>
  );
}

function HomeSection({
  eyebrow,
  title,
  children,
  surface = false,
}: {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  surface?: boolean;
}) {
  return (
    <section
      className="px-6 md:px-12"
      style={{
        paddingTop: "var(--lab-section-y)",
        paddingBottom: "var(--lab-section-y)",
        backgroundColor: surface ? "var(--lab-surface)" : "var(--lab-bg)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--lab-green)", fontFamily: "var(--lab-sans)" }}
          >
            {eyebrow}
          </p>
        )}
        {title ? (
          <h2
            className="mt-2 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: "var(--lab-serif)", color: "var(--lab-text)" }}
          >
            {title}
          </h2>
        ) : null}
        <div className={title ? "mt-10" : undefined}>{children}</div>
      </div>
    </section>
  );
}

function HomeHeroSplit() {
  return (
    <section className="grid min-h-[100svh] lg:grid-cols-2">
      <div
        className="flex flex-col justify-end p-8 md:p-14"
        style={{ background: "var(--lab-surface)" }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--lab-muted)", fontFamily: "var(--lab-sans)" }}
        >
          {labCopy.location}
        </p>
        <h1
          className="mt-4 text-4xl leading-tight md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--lab-serif)", color: "var(--lab-text)" }}
        >
          {labCopy.farmName}
        </h1>
        <p className="mt-4 max-w-md text-lg" style={{ color: "var(--lab-muted)" }}>
          {labCopy.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#" className="lab-btn-primary" onClick={(e) => e.preventDefault()}>
            View current availability
          </a>
          <a href="#" className="lab-btn-outline" onClick={(e) => e.preventDefault()}>
            Inquire about flowers
          </a>
        </div>
      </div>
      <div className="relative min-h-[50vh] lg:min-h-full">
        <Image
          src={labPhotos.hero.src}
          alt={labPhotos.hero.alt}
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>
    </section>
  );
}

function HomeHeroImmersive() {
  return (
    <section className="relative min-h-[100svh]">
      <Image
        src={labPhotos.hero.src}
        alt={labPhotos.hero.alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0" style={{ background: "var(--lab-scrim)" }} aria-hidden />
      <div className="relative flex min-h-[100svh] flex-col justify-end px-8 pb-16 pt-24 md:px-14 md:pb-20">
        <p
          className="text-xs uppercase tracking-[0.2em] text-white/80"
          style={{ fontFamily: "var(--lab-sans)" }}
        >
          {labCopy.location}
        </p>
        <h1
          className="mt-3 max-w-2xl text-4xl leading-tight text-white md:text-6xl"
          style={{ fontFamily: "var(--lab-serif)" }}
        >
          {labCopy.farmName}
        </h1>
        <p className="mt-4 max-w-lg text-lg text-white/90">{labCopy.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#"
            className="lab-btn-primary"
            onClick={(e) => e.preventDefault()}
          >
            View current availability
          </a>
          <a
            href="#"
            className="lab-btn-outline border-white/50 text-white hover:border-white hover:bg-white/10 hover:text-white"
            onClick={(e) => e.preventDefault()}
          >
            Inquire about flowers
          </a>
        </div>
      </div>
    </section>
  );
}

function HomeHeroGrounded() {
  return (
    <section className="min-h-[100svh] flex flex-col">
      <div className="relative min-h-[85svh] flex-1">
        <Image
          src={labPhotos.hero.src}
          alt={labPhotos.hero.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "var(--lab-scrim)" }} aria-hidden />
        <div className="relative flex h-full min-h-[85svh] flex-col justify-end p-8 md:p-14">
          <h1
            className="text-4xl text-white md:text-5xl"
            style={{ fontFamily: "var(--lab-serif)" }}
          >
            {labCopy.farmName}
          </h1>
          <p className="mt-2 text-white/90">{labCopy.tagline}</p>
        </div>
      </div>
      <div
        className="grid shrink-0 border-t md:grid-cols-3"
        style={{ borderColor: "var(--lab-border)", background: "var(--lab-surface)" }}
      >
        {["Seasonal stems", "Event florals", "Farm pickup"].map((label) => (
          <div
            key={label}
            className="border-[var(--lab-border)] px-5 py-4 md:border-l first:md:border-l-0"
          >
            <p
              className="text-xs uppercase tracking-[0.14em]"
              style={{ color: "var(--lab-muted)", fontFamily: "var(--lab-sans)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
