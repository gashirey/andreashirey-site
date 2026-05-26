"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";

export function AnnouncementBar() {
  const { copy } = useSiteConfig();
  const { announcement } = copy;

  if (!announcement.enabled || !announcement.message?.trim()) return null;

  return (
    <div className="type-announcement border-b border-parchment bg-site-muted-band px-4 py-2 text-center">
      <p>
        {announcement.message}{" "}
        <Link href="/contact" className="underline">
          Contact
        </Link>
      </p>
    </div>
  );
}
