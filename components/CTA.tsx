import { Button } from "./Button";

type CTAProps = {
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CTA({ title, description, primary, secondary }: CTAProps) {
  return (
    <div className="rounded-2xl border border-parchment bg-white px-8 py-12 text-center shadow-sm md:px-16 md:py-14">
      <h2 className="font-serif text-2xl font-medium text-bark md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-stone leading-relaxed">
          {description}
        </p>
      )}
      {(primary || secondary) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {primary && (
            <Button href={primary.href} variant="primary">
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button href={secondary.href} variant="outline">
              {secondary.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
