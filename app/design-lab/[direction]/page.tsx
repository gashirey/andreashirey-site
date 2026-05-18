import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignLabNav } from "@/components/design-lab/DesignLabNav";
import { DirectionShowcase } from "@/components/design-lab/DirectionShowcase";
import { designDirections, getDirection, isValidDirectionId } from "@/lib/design-lab/directions";

type PageProps = {
  params: Promise<{ direction: string }>;
};

export function generateStaticParams() {
  return designDirections.map((d) => ({ direction: d.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { direction: id } = await params;
  const d = getDirection(id);
  if (!d) return { title: "Design Lab" };
  return {
    title: `Design Lab — ${d.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function DirectionFullPage({ params }: PageProps) {
  const { direction: id } = await params;
  if (!isValidDirectionId(id)) notFound();

  const direction = getDirection(id);
  if (!direction) notFound();

  return (
    <div className="min-h-screen">
      <DesignLabNav />
      <header
        className="border-b px-6 py-6 md:px-12"
        style={{
          backgroundColor: direction.colors.bg,
          borderColor: direction.colors.border,
          color: direction.colors.text,
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: direction.colors.muted, fontFamily: direction.sansVar }}
        >
          Full-page preview · Direction {id.toUpperCase()}
        </p>
        <h1
          className="mt-2 text-3xl font-medium md:text-4xl"
          style={{ fontFamily: direction.serifVar }}
        >
          {direction.name}
        </h1>
        <p className="mt-2 max-w-xl text-sm" style={{ color: direction.colors.muted }}>
          Scroll to experience this direction as a cohesive page. Salmon-forward palette
          for Louisa, Central Virginia.
        </p>
      </header>
      <DirectionShowcase direction={direction} mode="full" />
    </div>
  );
}
