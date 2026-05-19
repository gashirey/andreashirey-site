"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./Button";
import type { HeroFrame } from "@/lib/content";
import type { HeroLayout } from "@/lib/snapshots/types";

const SLIDE_MS = 9000;
const FADE_MS = 2000;

export type HeroSlide = {
  src: string;
  alt: string;
};

type HeroSliderProps = {
  slides: readonly HeroSlide[];
  title: string;
  subtitle?: string;
  frame?: HeroFrame;
  layout?: HeroLayout;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showSlideControls?: boolean;
};

export function HeroSlider({
  slides,
  title,
  subtitle,
  frame = "bleed",
  layout = "standard",
  primaryCta,
  secondaryCta,
  showSlideControls = true,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) return;
    const id = window.setInterval(advance, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [advance, reducedMotion, slides.length]);

  const inset = frame === "inset";
  const immersive = layout === "immersive";
  const minHeight = immersive
    ? "min-h-[100svh]"
    : "min-h-[72vh] md:min-h-[78vh]";

  const imageRegion = (
    <div
      className={`relative ${minHeight} ${inset ? "overflow-hidden border border-site-border" : "overflow-hidden"}`}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slider-fade absolute inset-0 ${i === index ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDuration: reducedMotion ? "0ms" : `${FADE_MS}ms` }}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={i === index ? slide.alt : ""}
            fill
            priority={i === 0}
            className="object-cover"
            sizes={inset ? "(max-width: 1280px) 100vw, 1280px" : "100vw"}
          />
        </div>
      ))}
      <div className="hero-scrim" aria-hidden />
      <div
        className={`relative flex ${minHeight} flex-col justify-end px-6 pb-12 pt-8 lg:px-10 ${immersive ? "md:pb-20" : "lg:pb-16"}`}
      >
        <h1 className="max-w-2xl font-serif text-4xl font-medium leading-[1.1] text-white md:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-md text-base text-white/85 md:text-lg">
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
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

      {showSlideControls && slides.length > 1 && (
        <div
          className="absolute bottom-5 left-6 flex gap-2 lg:left-8"
          role="tablist"
          aria-label="Hero images"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image: ${slide.alt}`}
              onClick={() => setIndex(i)}
              className={`h-0.5 w-8 rounded-sm transition-colors ${
                i === index ? "bg-white" : "bg-white/35 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (inset) {
    return (
      <section className="bg-site-page px-5 py-5 md:px-10 md:py-8 lg:px-14">
        <div className="mx-auto max-w-6xl">{imageRegion}</div>
      </section>
    );
  }

  return <section className="relative bg-site-page">{imageRegion}</section>;
}
