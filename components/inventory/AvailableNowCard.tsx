import Image from "next/image";
import type { AvailableNowItem } from "@/lib/inventory/types";
import {
  formatBunchesAvailable,
  formatPricePerBunch,
  formatStemsPerBunch,
  statusChipStyles,
  statusLabels,
} from "@/lib/inventory/format";

type AvailableNowCardProps = {
  item: AvailableNowItem;
};

export function AvailableNowCard({ item }: AvailableNowCardProps) {
  const statusKey = item.status === "limited" ? "limited" : "available";

  return (
    <article className="card">
      <div className="image-frame relative aspect-[4/3]">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="border-t border-parchment p-5 md:p-6">
        <span className={`chip ${statusChipStyles[statusKey]}`}>
          {statusLabels[item.status]}
        </span>
        <h3 className="mt-3 font-serif text-xl text-bark md:text-2xl">
          {item.name}
        </h3>
        {(item.variety || item.color) && (
          <p className="mt-1 text-xs text-stone">
            {[item.variety, item.color].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-4 text-sm text-bark">
          <span className="font-medium">{formatPricePerBunch(item.bunchPrice)}</span>
          <span className="text-stone"> · {formatStemsPerBunch(item.stemsPerBunch)}</span>
        </p>
        <p className="mt-1 text-sm text-stone">
          {formatBunchesAvailable(item.bunchesAvailable)}
        </p>
        {item.notes ? (
          <p className="mt-3 text-sm text-stone">{item.notes}</p>
        ) : null}
      </div>
    </article>
  );
}
