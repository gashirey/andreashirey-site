type SectionProps = {
  id?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "white" | "parchment";
  className?: string;
};

const variants = {
  default: "bg-cream",
  white: "bg-white",
  parchment: "bg-parchment",
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
    <section id={id} className={`py-16 md:py-24 ${variants[variant]} ${className}`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {(eyebrow || title || description) && (
          <header className="mb-12 max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-salmon">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-2 font-serif text-3xl font-medium text-bark md:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-stone md:text-lg">
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
