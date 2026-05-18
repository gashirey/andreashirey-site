import { DesignLabNav } from "@/components/design-lab/DesignLabNav";
import { DirectionShowcase } from "@/components/design-lab/DirectionShowcase";
import { designDirections } from "@/lib/design-lab/directions";

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-[#f0eeea]">
      <DesignLabNav />

      <header className="border-b border-bark/10 bg-cream px-6 py-16 md:px-12 md:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
          Internal · Not for production
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-bark md:text-5xl">
          Grey Gables Farm — Design Lab
        </h1>
        <p className="mt-4 max-w-2xl text-stone leading-relaxed">
          Explore three visual directions before committing to the production
          site. Each section tests typography, palette, spacing, and edival
          tone. Replace all marked placeholders with Andrea&apos;s photography.
        </p>
        <p className="mt-6 max-w-2xl text-sm text-stone">
          Target feeling:{" "}
          <em className="text-bark">
            quiet editorial countryside elegance with edival warmth and
            authentic farm grounding.
          </em>
        </p>
      </header>

      {designDirections.map((direction) => (
        <DirectionShowcase key={direction.id} direction={direction} />
      ))}

      <footer className="border-t border-bark/10 bg-cream px-6 py-12 text-center text-sm text-stone md:px-12">
        <p>
          End of design lab. Share feedback on Direction A, B, or C before
          applying to the live site.
        </p>
        <a href="/" className="mt-4 inline-block text-sage-dark underline underline-offset-2">
          Return to site preview
        </a>
      </footer>
    </div>
  );
}
