import Link from "next/link";
import { AvailableNowCard } from "./AvailableNowCard";
import { formatDisplayDate } from "@/lib/inventory/date";
import { getAvailableNow, isInventoryConfigured } from "@/lib/inventory/queries";

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
        <p className="mb-8 text-sm text-stone">{formatDisplayDate(displayDate)}</p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-stone">
          Nothing listed today.{" "}
          <Link href="/contact?subject=flowers" className="underline">
            Ask what&apos;s in bloom
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2">
          {items.map((item) => (
            <AvailableNowCard key={item.availabilityId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
