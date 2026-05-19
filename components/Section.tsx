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
  const titleSize =
    density === "compact"
      ? "text-2xl md:text-3xl lg:text-[2.25rem]"
      : "text-3xl md:text-4xl lg:text-[2.75rem]";

  return (
    <section
      id={id}
      className={`${spacing} ${variants[variant]} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {(eyebrow || title || description) && (
          <header className={`${headerSpacing} max-w-xl`}>
            {eyebrow && (
              <p className="text-xs font-medium tracking-wide text-site-green">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={`font-serif font-medium leading-tight text-bark ${titleSize} ${eyebrow ? "mt-2" : ""}`}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-stone md:text-base">
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
