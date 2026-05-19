import { HomePageContent } from "@/components/home/HomePageContent";
import { directionToSiteCssVars } from "@/lib/site-theme";
import { getDirection } from "@/lib/design-lab/directions";
import type { SiteSnapshot } from "@/lib/snapshots/types";

type SampleHomePreviewProps = {
  snapshot: SiteSnapshot;
};

export function SampleHomePreview({ snapshot }: SampleHomePreviewProps) {
  const direction = getDirection(snapshot.directionId);
  if (!direction) return null;

  const style = directionToSiteCssVars(direction);

  return (
    <div className="site-theme" style={style}>
      <div className="border-b border-site-border bg-site-surface px-4 py-3 text-center text-xs text-stone">
        <p className="font-medium text-bark">
          Snapshot · {snapshot.label}
        </p>
        <p className="mt-1">
          {snapshot.id} · {snapshot.createdAt}
          {snapshot.notes ? ` — ${snapshot.notes}` : ""}
        </p>
      </div>
      <HomePageContent
        heroFrame={snapshot.home.heroFrame}
        heroLayout={snapshot.home.heroLayout}
      />
    </div>
  );
}
