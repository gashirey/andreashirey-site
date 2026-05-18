import Image from "next/image";

type PhotoPlaceholderProps = {
  /** Describe the shot for Andrea, e.g. "hero — field at dawn" */
  label: string;
  src?: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
};

export function PhotoPlaceholder({
  label,
  src = "/images/placeholders/gallery-1.svg",
  aspect = "aspect-[4/5]",
  className = "",
  priority = false,
}: PhotoPlaceholderProps) {
  return (
    <figure className={`relative overflow-hidden bg-[var(--lab-border)] ${aspect} ${className}`}>
      <Image
        src={src}
        alt={`Placeholder — ${label}`}
        fill
        priority={priority}
        className="object-cover opacity-85"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <figcaption className="absolute inset-x-0 bottom-0 border-t border-[var(--lab-border)] bg-[var(--lab-surface)]/95 px-3 py-2 font-[family-name:var(--lab-sans)] text-[0.65rem] uppercase tracking-[0.12em] text-[var(--lab-muted)]">
        REPLACE — Andrea&apos;s photography: {label}
      </figcaption>
    </figure>
  );
}
