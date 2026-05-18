import Image from "next/image";

type PhotoPlaceholderProps = {
  /** Shot description — shown only when using a placeholder image */
  label: string;
  src?: string;
  alt?: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
};

export function PhotoPlaceholder({
  label,
  src = "/images/placeholders/gallery-1.svg",
  alt,
  aspect = "aspect-[4/5]",
  className = "",
  priority = false,
}: PhotoPlaceholderProps) {
  const isPlaceholder = src.includes("/placeholders/");
  const imageAlt = alt ?? (isPlaceholder ? `Placeholder — ${label}` : label);

  return (
    <figure className={`relative overflow-hidden bg-[var(--lab-border)] ${aspect} ${className}`}>
      <Image
        src={src}
        alt={imageAlt}
        fill
        priority={priority}
        className={`object-cover ${isPlaceholder ? "opacity-85" : ""}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {isPlaceholder && (
        <figcaption className="absolute inset-x-0 bottom-0 border-t border-[var(--lab-border)] bg-[var(--lab-surface)]/95 px-3 py-2 font-[family-name:var(--lab-sans)] text-[0.65rem] uppercase tracking-[0.12em] text-[var(--lab-muted)]">
          REPLACE — Farm photo: {label}
        </figcaption>
      )}
    </figure>
  );
}
