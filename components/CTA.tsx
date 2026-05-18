import { Button } from "./Button";

type CTAProps = {
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CTA({ title, description, primary, secondary }: CTAProps) {
  return (
    <div className="card border-y px-6 py-12 text-center md:px-12 md:py-14">
      <h2 className="font-serif text-2xl font-medium text-bark md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-stone leading-relaxed">
          {description}
        </p>
      )}
      {(primary || secondary) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
