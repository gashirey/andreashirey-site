import Image from "next/image";
import { Button } from "./Button";

type HeroProps = {
  title: string;
  subtitle?: string;
  /** Replace src with a real farm hero image, e.g. /images/hero.jpg */
  imageSrc: string;
  imageAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  compact?: boolean;
};

export function Hero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  primaryCta,
  secondaryCta,
  compact = false,
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-parchment ${compact ? "min-h-[40vh]" : "min-h-[70vh] md:min-h-[75vh]"}`}
    >
      {/* PHOTO: Replace imageSrc with your signature farm or field image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bark/70 via-bark/30 to-bark/10" />
      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-6 pb-16 pt-32 lg:px-8 lg:pb-20">
        <h1 className="max-w-2xl font-serif text-4xl font-medium leading-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {primaryCta && (
              <Button href={primaryCta.href} variant="primary">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="outline" className="border-white/40 text-white hover:border-white hover:text-white">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
