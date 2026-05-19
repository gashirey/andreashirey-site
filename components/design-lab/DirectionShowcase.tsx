"use client";

import type { DesignDirection } from "@/lib/design-lab/directions";
import { labCopy } from "@/lib/design-lab/directions";
import { labPhotos } from "@/lib/design-lab/photos";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

type DirectionShowcaseProps = {
  direction: DesignDirection;
  /** specimen = labeled sections on overview; full = immersive single-direction page */
  mode?: "specimen" | "full";
};

export function DirectionShowcase({
  direction,
  mode = "specimen",
}: DirectionShowcaseProps) {
  const d = direction;
  const isFull = mode === "full";
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
    "--lab-block-y": d.spacing.blockY,
    "--lab-gutter": d.spacing.gutter,
    backgroundColor: d.colors.bg,
    color: d.colors.text,
    fontFamily: d.sansVar,
  } as React.CSSProperties;

  return (
    <section
      id={isFull ? undefined : `direction-${d.id}`}
      className={`lab-direction ${isFull ? "min-h-screen" : "scroll-mt-24 border-b border-[var(--lab-border)]"}`}
      style={style}
      aria-labelledby={isFull ? undefined : `direction-${d.id}-title`}
    >
      {!isFull && (
      <div
        className="border-b border-[var(--lab-border)] px-6 py-10 md:px-12"
        style={{ paddingTop: "var(--lab-section-y)", paddingBottom: "2.5rem" }}
      >
        <p
          className="font-[family-name:var(--lab-sans)] text-xs uppercase tracking-[0.2em] text-[var(--lab-muted)]"
        >
          Direction {d.id.toUpperCase()}
        </p>
        <h2
          id={`direction-${d.id}-title`}
          className="mt-2 font-[family-name:var(--lab-serif)] text-4xl font-medium md:text-5xl"
        >
          {d.name}
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--lab-muted)] leading-relaxed">
          {d.essence}
        </p>
      </div>
      )}

      <LabBlock title={isFull ? undefined : "Hero"} flush={isFull}>
        {d.hero === "split" && <HeroSplit full={isFull} />}
        {d.hero === "immersive" && <HeroImmersive full={isFull} />}
        {d.hero === "grounded" && <HeroGrounded full={isFull} />}
      </LabBlock>

      <LabBlock title={isFull ? undefined : "Typography"}>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="lab-label">Display — Serif</p>
            <p className="mt-2 font-[family-name:var(--lab-serif)] text-5xl leading-[1.1] md:text-6xl">
              Grey Gables
            </p>
            <p className="mt-1 font-[family-name:var(--lab-serif)] text-3xl italic text-[var(--lab-muted)]">
              Farm
            </p>
          </div>
          <div>
            <p className="lab-label">Body — Sans</p>
            <p className="mt-2 max-w-md text-base leading-relaxed text-[var(--lab-muted)]">
              We grow seasonal flowers for everyday bouquets, intimate gatherings,
              and milestone celebrations — gathered slowly, shared with care.
            </p>
            <p className="lab-label mt-8">Caption / Label</p>
            <p className="mt-2 font-[family-name:var(--lab-sans)] text-xs uppercase tracking-[0.18em] text-[var(--lab-muted)]">
              {labCopy.locationShort} · Seasonal availability
            </p>
          </div>
        </div>
      </LabBlock>

      {/* Palette */}
      <LabBlock title={isFull ? undefined : "Color palette"}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-7">
          {[
            { name: "Background", hex: d.colors.bg },
            { name: "Surface", hex: d.colors.surface },
            { name: "Text", hex: d.colors.text },
            { name: "Muted", hex: d.colors.muted },
            { name: "Accent", hex: d.colors.accent },
            { name: "Garden", hex: d.colors.green },
            { name: "Border", hex: d.colors.border },
          ].map((swatch) => (
            <li key={swatch.name}>
              <div
                className="h-16 border border-[var(--lab-border)]"
                style={{ backgroundColor: swatch.hex }}
              />
              <p className="mt-2 font-[family-name:var(--lab-sans)] text-xs text-[var(--lab-muted)]">
                {swatch.name}
              </p>
              <p className="font-mono text-[0.65rem] text-[var(--lab-muted)]">
                {swatch.hex}
              </p>
            </li>
          ))}
        </ul>
      </LabBlock>

      {/* Nav */}
      <LabBlock title={isFull ? undefined : "Navigation sample"}>
        <header className="flex flex-col gap-4 border border-[var(--lab-border)] bg-[var(--lab-surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block font-[family-name:var(--lab-serif)] text-xl">
              {labCopy.farmName}
            </span>
            <span className="font-[family-name:var(--lab-sans)] text-[0.65rem] uppercase tracking-[0.16em] text-[var(--lab-muted)]">
              {labCopy.location}
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--lab-sans)] text-sm text-[var(--lab-muted)]">
            {["Flowers", "Gallery", "About", "Events", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors hover:text-[var(--lab-green)]"
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </nav>
        </header>
      </LabBlock>

      {/* Buttons */}
      <LabBlock title={isFull ? undefined : "CTA buttons"}>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="lab-btn-primary" onClick={(e) => e.preventDefault()}>
            View current availability
          </a>
          <a href="#" className="lab-btn-outline" onClick={(e) => e.preventDefault()}>
            Inquire about flowers
          </a>
          <a href="#" className="lab-btn-ghost" onClick={(e) => e.preventDefault()}>
            Weddings & events
          </a>
        </div>
      </LabBlock>

      {/* Gallery */}
      <LabBlock title={isFull ? undefined : "Gallery / image treatment"}>
        <div className="grid gap-[var(--lab-gutter)] sm:grid-cols-3">
          <PhotoPlaceholder
            src={labPhotos.hero.src}
            alt={labPhotos.hero.alt}
            label="field morning light"
            aspect="aspect-[3/4]"
          />
          <PhotoPlaceholder
            src={labPhotos.bouquet.src}
            alt={labPhotos.bouquet.alt}
            label="bouquet detail"
            aspect="aspect-square"
            className="sm:mt-8"
          />
          <PhotoPlaceholder
            src={labPhotos.gardenRow.src}
            alt={labPhotos.gardenRow.alt}
            label="cutting garden row"
            aspect="aspect-[4/5]"
          />
        </div>
      </LabBlock>

      {/* Product card */}
      <LabBlock title={isFull ? undefined : "Product / inventory card"}>
        <article className="max-w-md border border-[var(--lab-border)] bg-[var(--lab-surface)]">
          <PhotoPlaceholder
            src={labPhotos.bouquet.src}
            alt={labPhotos.bouquet.alt}
            label="mixed seasonal bouquet — product"
            aspect="aspect-[4/3]"
          />
          <div className="border-t border-[var(--lab-border)] p-5">
            <span
              className="inline-block px-2 py-0.5 font-[family-name:var(--lab-sans)] text-xs tracking-wide"
              style={{
                backgroundColor: "var(--lab-chip)",
                color: "var(--lab-chip-text)",
              }}
            >
              {labCopy.product.status}
            </span>
            <h3 className="mt-3 font-[family-name:var(--lab-serif)] text-2xl">
              {labCopy.product.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--lab-muted)]">
              {labCopy.product.description}
            </p>
          </div>
        </article>
      </LabBlock>

      {/* Quote */}
      <LabBlock title={isFull ? undefined : "Quote / testimonial"}>
        <blockquote className="max-w-2xl border-l-2 border-[var(--lab-green)] pl-6">
          <p className="font-[family-name:var(--lab-serif)] text-2xl leading-snug md:text-3xl">
            &ldquo;{labCopy.quote.text}&rdquo;
          </p>
          <footer className="mt-4 font-[family-name:var(--lab-sans)] text-sm text-[var(--lab-muted)]">
            — {labCopy.quote.attribution}
          </footer>
        </blockquote>
      </LabBlock>

      {/* Spacing */}
      {!isFull && (
      <LabBlock title="Section spacing" className="!pb-[var(--lab-section-y)]">
        <div className="space-y-4 font-[family-name:var(--lab-sans)] text-sm text-[var(--lab-muted)]">
          <div className="flex items-center gap-4">
            <span className="w-24 shrink-0">Section Y</span>
            <span className="h-8 flex-1 border border-dashed border-[var(--lab-border)]" style={{ height: d.spacing.sectionY }} />
            <span className="font-mono text-xs">{d.spacing.sectionY}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 shrink-0">Block gap</span>
            <span style={{ width: d.spacing.blockY, height: "1rem", background: "var(--lab-border)" }} />
            <span className="font-mono text-xs">{d.spacing.blockY}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 shrink-0">Gutter</span>
            <span style={{ width: d.spacing.gutter, height: "1rem", background: "var(--lab-border)" }} />
            <span className="font-mono text-xs">{d.spacing.gutter}</span>
          </div>
        </div>
        <p className="lab-label mt-10">Mobile</p>
        <p className="mt-2 max-w-lg text-sm text-[var(--lab-muted)]">
          All patterns stack to a single column below 640px. Navigation wraps;
          gallery becomes vertical scroll. Tap targets remain full-width buttons.
        </p>
      </LabBlock>
      )}
    </section>
  );
}

function LabBlock({
  title,
  children,
  className = "",
  flush = false,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <div
      className={`border-b border-[var(--lab-border)] ${flush ? "" : "px-6 md:px-12"} ${className}`}
      style={{
        paddingTop: flush ? 0 : "var(--lab-block-y)",
        paddingBottom: "var(--lab-section-y)",
      }}
    >
      {title ? (
        <h3 className="lab-label mb-8 px-6 pt-[var(--lab-block-y)] md:px-12">{title}</h3>
      ) : null}
      {children}
    </div>
  );
}

function HeroSplit({ full = false }: { full?: boolean }) {
  const minH = full ? "min-h-screen" : "min-h-[52vh]";
  return (
    <div className={`grid ${minH} md:grid-cols-2`}>
      <div className="flex flex-col justify-end bg-[var(--lab-surface)] p-8 md:p-12">
        <p className="font-[family-name:var(--lab-sans)] text-xs uppercase tracking-[0.2em] text-[var(--lab-muted)]">
          {labCopy.location}
        </p>
        <h3 className="mt-3 font-[family-name:var(--lab-serif)] text-4xl leading-tight md:text-5xl">
          {labCopy.farmName}
        </h3>
        <p className="mt-4 max-w-sm text-[var(--lab-muted)]">{labCopy.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#" className="lab-btn-primary" onClick={(e) => e.preventDefault()}>
            View availability
          </a>
        </div>
      </div>
      <PhotoPlaceholder
        src={labPhotos.hero.src}
        alt={labPhotos.hero.alt}
        label="hero — wide field or barn facade"
        aspect="aspect-auto min-h-[40vh] md:min-h-full"
        priority
      />
    </div>
  );
}

function HeroImmersive({ full = false }: { full?: boolean }) {
  const minH = full ? "min-h-screen" : "min-h-[58vh]";
  return (
    <div className={`relative ${minH}`}>
      <PhotoPlaceholder
        src={labPhotos.hero.src}
        alt={labPhotos.hero.alt}
        label="hero — immersive floral close-up or garden path"
        aspect={`aspect-auto absolute inset-0 ${minH}`}
        priority
      />
      <div className="absolute inset-0" style={{ background: "var(--lab-scrim)" }} aria-hidden />
      <div className={`relative flex ${minH} flex-col justify-end px-8 pb-12 pt-24 md:px-12 md:pb-16`}>
        <p className="font-[family-name:var(--lab-sans)] text-xs uppercase tracking-[0.2em] text-white/80">
          {labCopy.location}
        </p>
        <h3 className="mt-2 max-w-lg font-[family-name:var(--lab-serif)] text-4xl text-white md:text-5xl">
          {labCopy.tagline}
        </h3>
        <a href="#" className="lab-btn-primary mt-8 w-fit border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={(e) => e.preventDefault()}>
          Inquire about flowers
        </a>
      </div>
    </div>
  );
}

function HeroGrounded({ full = false }: { full?: boolean }) {
  const minH = full ? "min-h-[70vh]" : "min-h-[48vh]";
  return (
    <div className={`${full ? "" : "border border-[var(--lab-border)]"} bg-[var(--lab-surface)]`}>
      <div className={`relative ${minH}`}>
        <PhotoPlaceholder
          src={labPhotos.hero.src}
          alt={labPhotos.hero.alt}
          label="hero — tactile farm detail, buckets or greenhouse"
          aspect={`aspect-auto absolute inset-0 ${minH}`}
          priority
        />
        <div className="absolute inset-0" style={{ background: "var(--lab-scrim)" }} aria-hidden />
        <div className={`relative flex ${minH} items-end p-8 md:p-10`}>
          <div>
            <h3 className="font-[family-name:var(--lab-serif)] text-3xl text-white md:text-4xl">
              {labCopy.farmName}
            </h3>
            <p className="mt-2 text-sm text-white/85">{labCopy.tagline}</p>
          </div>
        </div>
      </div>
      <div className="grid border-t border-[var(--lab-border)] md:grid-cols-3">
        {["Seasonal stems", "Event florals", "Farm pickup"].map((item) => (
          <div key={item} className="border-[var(--lab-border)] px-5 py-4 md:border-l first:md:border-l-0">
            <p className="font-[family-name:var(--lab-sans)] text-xs uppercase tracking-[0.14em] text-[var(--lab-muted)]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
