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
      className={`relative overflow-hidden bg-parchment ${compact ? "min-h-[36vh]" : "min-h-[62vh] md:min-h-[68vh]"}`}
    >
      {/* PHOTO: Replace imageSrc with your signature farm or field image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Flat scrim only — no gradients */}
      <div className="hero-scrim" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-6 pb-14 pt-28 lg:px-8 lg:pb-16">
        <h1 className="max-w-2xl font-serif text-4xl font-medium leading-tight text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {primaryCta && (
              <Button href={primaryCta.href} variant="primary">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                variant="outline"
                className="border-white/50 text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
