import Link from "next/link";
import { announcement } from "@/lib/content";

export function AnnouncementBar() {
  if (!announcement.enabled) return null;

  return (
    <div className="border-b border-salmon/15 bg-salmon/10 px-4 py-2 text-center text-xs text-bark sm:text-sm">
      <p>
        {announcement.message}{" "}
        <Link
          href="/flowers"
          className="font-medium text-salmon-dark underline underline-offset-2 hover:text-salmon"
        >
          View flowers
        </Link>
      </p>
    </div>
  );
}
