import Image from "next/image";
import type { AvailableNowItem } from "@/lib/inventory/types";
import {
  formatBunchesAvailable,
  formatHarvestLabel,
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
  const harvest = formatHarvestLabel(item.harvestDate);

  return (
    <article className="card">
      <div className="image-frame relative aspect-[4/3]">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="border-t border-parchment p-5">
        <span className={`chip ${statusChipStyles[statusKey]}`}>
          {statusLabels[item.status]}
        </span>
        <h3 className="mt-3 font-serif text-xl text-bark">{item.name}</h3>
        {(item.variety || item.color) && (
          <p className="mt-1 text-xs uppercase tracking-wide text-stone">
            {[item.variety, item.color].filter(Boolean).join(" · ")}
          </p>
        )}
        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-stone">
            {item.description}
          </p>
        )}
        <dl className="mt-4 space-y-1 text-sm text-bark">
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Price</dt>
            <dd className="font-medium">{formatPricePerBunch(item.bunchPrice)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Size</dt>
            <dd>{formatStemsPerBunch(item.stemsPerBunch)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone">Stock</dt>
            <dd className="font-medium">
              {formatBunchesAvailable(item.bunchesAvailable)}
            </dd>
          </div>
        </dl>
        {harvest && (
          <p className="mt-3 text-xs text-site-green">{harvest}</p>
        )}
        {item.notes && (
          <p className="mt-2 text-sm italic text-stone">{item.notes}</p>
        )}
      </div>
    </article>
  );
}
