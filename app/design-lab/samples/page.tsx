import Link from "next/link";
import { DesignLabNav } from "@/components/design-lab/DesignLabNav";
import { siteSnapshots } from "@/lib/snapshots/registry";
import { getDirection } from "@/lib/design-lab/directions";

export default function SamplesIndexPage() {
  return (
    <div className="min-h-screen bg-cream">
      <DesignLabNav />

      <header className="border-b border-parchment px-6 py-12 md:px-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
          Team review
        </p>
        <h1 className="mt-2 font-serif text-3xl text-bark md:text-4xl">
          Homepage snapshots
        </h1>
        <p className="mt-3 max-w-2xl text-stone leading-relaxed">
          Frozen homepage configurations saved when you say{" "}
          <strong className="font-medium text-bark">snapshot</strong> during design
          work. Live site may continue to change — these pages preserve a moment in
          time for demos.
        </p>
        <Link
          href="/design-lab"
          className="mt-6 inline-block text-sm text-salmon-dark underline underline-offset-2 hover:text-salmon"
        >
          ← Design lab
        </Link>
      </header>

      <ul className="mx-auto max-w-3xl divide-y divide-parchment px-6 py-8 md:px-12">
        {siteSnapshots.map((snapshot) => {
          const direction = getDirection(snapshot.directionId);
          return (
            <li key={snapshot.id} className="py-6">
              <Link
                href={`/design-lab/samples/${snapshot.id}`}
                className="group block"
              >
                <p className="font-serif text-xl text-bark group-hover:text-salmon-dark">
                  {snapshot.label}
                </p>
                <p className="mt-1 text-sm text-stone">
                  {snapshot.id} · Direction {snapshot.directionId.toUpperCase()}
                  {direction ? ` (${direction.name})` : ""} · {snapshot.createdAt}
                </p>
                {snapshot.notes && (
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    {snapshot.notes}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
