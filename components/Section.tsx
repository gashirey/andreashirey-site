type SectionProps = {
  id?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "surface" | "muted" | "white" | "parchment";
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
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 lg:py-32 ${variants[variant]} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {(eyebrow || title || description) && (
          <header className="mb-14 max-w-xl">
            {eyebrow && (
              <p className="text-xs font-medium tracking-wide text-site-green">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={`font-serif text-3xl font-medium leading-tight text-bark md:text-4xl lg:text-[2.75rem] ${eyebrow ? "mt-2" : ""}`}
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
