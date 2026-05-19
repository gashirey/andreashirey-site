import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectionHomePreview } from "@/components/design-lab/DirectionHomePreview";
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
    title: `Design Lab — ${d.name} (home preview)`,
    robots: { index: false, follow: false },
  };
}

export default async function DirectionFullPage({ params }: PageProps) {
  const { direction: id } = await params;
  if (!isValidDirectionId(id)) notFound();

  const direction = getDirection(id);
  if (!direction) notFound();

  return <DirectionHomePreview direction={direction} />;
}
