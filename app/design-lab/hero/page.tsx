import Link from "next/link";
import { DesignLabNav } from "@/components/design-lab/DesignLabNav";
import { HeroSlider } from "@/components/HeroSlider";
import { heroSlides, site } from "@/lib/content";
const cta = {
  primary: {
    label: "View work",
    href: "/gallery",
  },
  secondary: {
    label: "Contact",
    href: "/contact",
  },
} as const;

export default function HeroFrameLabPage() {
  return (
    <div className="min-h-screen bg-cream">
      <DesignLabNav />

      <header className="border-b border-parchment px-6 py-12 md:px-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
          Hero comparison
        </p>
        <h1 className="mt-2 font-serif text-3xl text-bark md:text-4xl">
          Full bleed vs inset frame
        </h1>
        <p className="mt-3 max-w-2xl text-stone leading-relaxed">
          Same slow slider and Direction C salmon buttons. Production home uses{" "}
          <strong className="font-medium text-bark">full bleed</strong> by default — change{" "}
          <code className="text-sm">homeHeroFrame</code> in{" "}
          <code className="text-sm">lib/content.ts</code> to{" "}
          <code className="text-sm">&quot;inset&quot;</code> when you are ready.
        </p>
        <Link
          href="/design-lab"
          className="mt-6 inline-block text-sm text-salmon-dark underline underline-offset-2 hover:text-salmon"
        >
          ← Back to design lab
        </Link>
      </header>

      <section className="border-b border-parchment">
        <div className="px-6 py-6 md:px-12">
          <h2 className="font-serif text-xl text-bark">Full bleed</h2>
          <p className="mt-1 text-sm text-stone">
            Edge-to-edge imagery — current homepage default.
          </p>
        </div>
        <HeroSlider
          slides={heroSlides}
          frame="bleed"
          title={site.name}
          subtitle={site.tagline}
          {...cta}
        />
      </section>

      <section>
        <div className="px-6 py-6 md:px-12">
          <h2 className="font-serif text-xl text-bark">Inset frame</h2>
          <p className="mt-1 text-sm text-stone">
            Cream margin left and right with a hairline border around the image.
          </p>
        </div>
        <HeroSlider
          slides={heroSlides}
          frame="inset"
          title={site.name}
          subtitle={site.tagline}
          {...cta}
        />
      </section>
    </div>
  );
}
