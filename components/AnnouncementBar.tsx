"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";

export function AnnouncementBar() {
  const { copy } = useSiteConfig();
  const { announcement } = copy;

  if (!announcement.enabled) return null;

  return (
    <div className="border-b border-parchment bg-site-muted-band px-4 py-2 text-center text-xs text-stone">
      <p>
        {announcement.message}{" "}
        <Link href="/available-now" className="underline">
          View list
        </Link>
      </p>
    </div>
  );
}
