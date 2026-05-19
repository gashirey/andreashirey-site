import Link from "next/link";
import { AvailableNowCard } from "./AvailableNowCard";
import { formatDisplayDate } from "@/lib/inventory/date";
import { getAvailableNow } from "@/lib/inventory/queries";
import { isInventoryConfigured } from "@/lib/inventory/queries";

type AvailableNowSectionProps = {
  showHeading?: boolean;
  date?: string;
};

export async function AvailableNowSection({
  showHeading = true,
  date,
}: AvailableNowSectionProps) {
  if (!isInventoryConfigured()) {
    return null;
  }

  const { date: displayDate, items } = await getAvailableNow(date);

  return (
    <div>
      {showHeading && (
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-site-green">
              Available now
            </p>
            <p className="mt-1 text-sm text-stone">{formatDisplayDate(displayDate)}</p>
          </div>
          <Link
            href="/available-now"
            className="text-sm text-salmon-dark underline underline-offset-2 hover:text-salmon"
          >
            View full list
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div className="border border-parchment bg-site-surface px-5 py-8 text-center text-sm text-stone">
          <p>Nothing listed for today yet — check back soon.</p>
          <p className="mt-2">
            <Link
              href="/contact?subject=flowers"
              className="text-salmon-dark underline underline-offset-2"
            >
              Ask about availability
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((item) => (
            <AvailableNowCard key={item.availabilityId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
