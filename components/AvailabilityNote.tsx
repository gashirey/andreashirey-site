import { availabilityUpdated } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function AvailabilityNote() {
  return (
    <p className="text-sm text-stone">
      Availability last updated{" "}
      <time dateTime={availabilityUpdated} className="font-medium text-bark">
        {formatDate(availabilityUpdated)}
      </time>
    </p>
  );
}
