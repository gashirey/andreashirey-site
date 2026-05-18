import Link from "next/link";
import { announcement } from "@/lib/content";

export function AnnouncementBar() {
  if (!announcement.enabled) return null;

  return (
    <div className="border-b border-sage/15 bg-sage/10 px-4 py-2.5 text-center text-sm text-bark">
      <p>
        {announcement.message}{" "}
        <Link
          href="/flowers"
          className="font-medium text-sage-dark underline underline-offset-2 hover:text-sage"
        >
          View flowers
        </Link>
      </p>
    </div>
  );
}
