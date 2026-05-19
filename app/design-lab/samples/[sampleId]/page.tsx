import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DesignLabNav } from "@/components/design-lab/DesignLabNav";
import { SampleHomePreview } from "@/components/samples/SampleHomePreview";
import { getSnapshot, isValidSnapshotId, siteSnapshots } from "@/lib/snapshots/registry";

type PageProps = {
  params: Promise<{ sampleId: string }>;
};

export function generateStaticParams() {
  return siteSnapshots.map((s) => ({ sampleId: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sampleId } = await params;
  const snapshot = getSnapshot(sampleId);
  if (!snapshot) return { title: "Snapshot" };
  return {
    title: `Snapshot — ${snapshot.label}`,
    robots: { index: false, follow: false },
  };
}

export default async function SamplePage({ params }: PageProps) {
  const { sampleId } = await params;
  if (!isValidSnapshotId(sampleId)) notFound();

  const snapshot = getSnapshot(sampleId);
  if (!snapshot) notFound();

  return (
    <div className="min-h-screen bg-cream">
      <DesignLabNav />
      <div className="border-b border-parchment bg-white px-4 py-2 text-center text-xs text-stone">
        <Link href="/design-lab/samples" className="underline underline-offset-2 hover:text-bark">
          All snapshots
        </Link>
        <span className="mx-2 text-parchment">·</span>
        <Link href="/" className="underline underline-offset-2 hover:text-bark">
          Live site
        </Link>
      </div>
      <SampleHomePreview snapshot={snapshot} />
    </div>
  );
}
