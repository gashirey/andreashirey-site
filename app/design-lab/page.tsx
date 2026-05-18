import Link from "next/link";
import { DesignLabNav } from "@/components/design-lab/DesignLabNav";
import { DirectionShowcase } from "@/components/design-lab/DirectionShowcase";
import { designDirections } from "@/lib/design-lab/directions";

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-[#f0ebe8]">
      <DesignLabNav />

      <header className="border-b border-parchment bg-cream px-6 py-16 md:px-12 md:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
          Internal · Not for production
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-bark md:text-5xl">
          Grey Gables Farm — Design Lab
        </h1>
        <p className="mt-4 max-w-2xl text-stone leading-relaxed">
          Compare three visual directions on the specimen overview below, or open a{" "}
          <strong className="font-medium text-bark">full-page preview</strong> for each.
          Uses <strong className="font-medium text-bark">hero.jpg</strong> and{" "}
          <strong className="font-medium text-bark">bb.jpg</strong> where wired; remaining
          slots show placeholders until more photos are added.
        </p>
        <p className="mt-6 max-w-2xl text-sm text-stone">
          Target feeling:{" "}
          <em className="text-bark">
            quiet editorial countryside elegance with emotional warmth and authentic
            farm grounding
          </em>
          — anchored in a light salmon / blush palette for Louisa, Central Virginia.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {designDirections.map((d) => (
            <li key={d.id}>
              <Link
                href={`/design-lab/${d.id}`}
                className="btn border-salmon-dark bg-salmon-dark text-white hover:bg-salmon"
              >
                Full page — {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </header>

      {designDirections.map((direction) => (
        <DirectionShowcase key={direction.id} direction={direction} mode="specimen" />
      ))}

      <footer className="border-t border-parchment bg-cream px-6 py-12 text-center text-sm text-stone md:px-12">
        <p>
          End of design lab. Share feedback on Direction A, B, or C before applying to
          the live site.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-salmon-dark underline underline-offset-2"
        >
          Return to site preview
        </Link>
      </footer>
    </div>
  );
}
