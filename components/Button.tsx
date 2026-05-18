import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-sage-dark text-white hover:bg-sage border-sage-dark",
  secondary: "bg-parchment text-bark hover:bg-parchment/90 border-parchment",
  outline:
    "bg-transparent text-bark border-bark/25 hover:border-sage-dark hover:text-sage-dark",
};

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
  const classes = `btn ${variants[variant]} ${className}`;

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
