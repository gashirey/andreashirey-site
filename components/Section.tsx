type SectionProps = {
  id?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "surface" | "muted" | "white" | "parchment";
  density?: "default" | "compact";
  className?: string;
};

const variants: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "bg-site-page",
  surface: "bg-site-surface",
  muted: "bg-site-muted-band border-y border-site-border",
  white: "bg-site-surface",
  parchment: "bg-site-muted-band",
};

export function Section({
  id,
  title,
  eyebrow,
  description,
  children,
  variant = "default",
  density = "default",
  className = "",
}: SectionProps) {
  const spacing =
    density === "compact"
      ? "py-12 md:py-20 lg:py-24"
      : "py-20 md:py-28 lg:py-32";
  const headerSpacing = density === "compact" ? "mb-8 md:mb-10" : "mb-14";
  return (
    <section
      id={id}
      className={`${spacing} ${variants[variant]} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {(eyebrow || title || description) && (
          <header className={`${headerSpacing} max-w-xl`}>
            {eyebrow && (
              <p className="type-eyebrow tracking-wide">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={`type-section-title leading-tight ${eyebrow ? "mt-2" : ""}`}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="type-section-description mt-3 leading-relaxed md:text-base">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
