import { sampleB } from "./samples/sample-b";
import type { SiteSnapshot } from "./types";

export const siteSnapshots: SiteSnapshot[] = [sampleB];

export function getSnapshot(id: string): SiteSnapshot | undefined {
  return siteSnapshots.find((s) => s.id === id);
}

export function isValidSnapshotId(id: string): boolean {
  return siteSnapshots.some((s) => s.id === id);
}

/** Next id when user requests a snapshot: sample-a, sample-b, sample-c, … */
export function suggestNextSampleId(): string {
  const used = new Set(siteSnapshots.map((s) => s.id));
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    const id = `sample-${letter}`;
    if (!used.has(id)) return id;
  }
  return `sample-${Date.now()}`;
}
