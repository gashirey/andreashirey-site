import { getLiveSiteConfig } from "./live";
import { suggestNextSampleId } from "./registry";
import type { SiteSnapshot } from "./types";
import { getDirection } from "@/lib/design-lab/directions";

/** Build a snapshot object from current live site settings (agent writes file from this). */
export function buildSnapshotFromLive(options: {
  label: string;
  notes?: string;
  id?: string;
}): SiteSnapshot {
  const live = getLiveSiteConfig();
  const direction = getDirection(live.directionId);
  const id = options.id ?? suggestNextSampleId();
  const date = new Date().toISOString().slice(0, 10);

  return {
    id,
    label: options.label,
    createdAt: date,
    directionId: live.directionId,
    home: { ...live.home },
    notes:
      options.notes ??
      `Snapshot of live site (${direction?.name ?? live.directionId}) on ${date}.`,
  };
}
