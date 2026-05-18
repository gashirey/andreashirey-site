import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-sage-dark text-white hover:bg-sage border-transparent",
  secondary:
    "bg-parchment text-bark hover:bg-parchment/80 border-transparent",
  outline:
    "bg-transparent text-bark border-bark/20 hover:border-sage-dark hover:text-sage-dark",
};

const base =
  "inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium tracking-wide transition-colors";

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  href: string;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  href,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
