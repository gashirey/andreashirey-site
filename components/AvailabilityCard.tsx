import Image from "next/image";
import type { AvailabilityItem } from "@/lib/content";

const statusLabels: Record<AvailabilityItem["status"], string> = {
  available: "Available now",
  limited: "Limited quantity",
  seasonal: "In season",
};

const statusStyles: Record<AvailabilityItem["status"], string> = {
  available: "bg-sage/15 text-sage-dark",
  limited: "bg-blush/20 text-bark",
  seasonal: "bg-parchment text-stone",
};

type AvailabilityCardProps = {
  item: AvailabilityItem;
};

export function AvailabilityCard({ item }: AvailabilityCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-parchment bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-parchment">
        {/* PHOTO: Replace with real product/listing photo for {item.name} */}
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-6">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
        >
          {statusLabels[item.status]}
        </span>
        <h3 className="mt-3 font-serif text-xl text-bark">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          {item.description}
        </p>
      </div>
    </article>
  );
}
