import Link from "next/link";
import { AvailableNowCard } from "./AvailableNowCard";
import { formatDisplayDate } from "@/lib/inventory/date";
import { getAvailableNow, isInventoryConfigured } from "@/lib/inventory/queries";

type AvailableNowSectionProps = {
  showHeading?: boolean;
  date?: string;
  /** Homepage preview — keeps scroll short */
  limit?: number;
};

export async function AvailableNowSection({
  showHeading = true,
  date,
  limit,
}: AvailableNowSectionProps) {
  if (!isInventoryConfigured()) {
    return (
      <p className="text-sm text-stone">
        <Link href="/contact?subject=flowers" className="underline">
          Contact the farm
        </Link>{" "}
        for this week&apos;s harvest list.
      </p>
    );
  }

  const { date: displayDate, items: allItems } = await getAvailableNow(date);
  const items = limit ? allItems.slice(0, limit) : allItems;

  return (
    <div>
      {showHeading && (
        <p className="mb-6 text-sm text-stone">{formatDisplayDate(displayDate)}</p>
      )}

      {!showHeading && items.length > 0 && (
        <p className="mb-6 text-sm text-stone">{formatDisplayDate(displayDate)}</p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-stone">
          Nothing listed this week.{" "}
          <Link href="/contact?subject=flowers" className="underline">
            Contact the farm
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="grid gap-8 sm:grid-cols-2">
            {items.map((item) => (
              <AvailableNowCard key={item.availabilityId} item={item} />
            ))}
          </div>
          {limit ? (
            <p className="mt-8 text-sm">
              <Link
                href="/available-now"
                className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
              >
                View seasonal flowers
              </Link>
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
