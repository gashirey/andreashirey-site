import Image from "next/image";
import type { AvailabilityItem } from "@/lib/content";

const statusLabels: Record<AvailabilityItem["status"], string> = {
  available: "Available now",
  limited: "Limited quantity",
  seasonal: "In season",
};

const statusStyles: Record<AvailabilityItem["status"], string> = {
  available: "bg-sage/15 text-sage-dark",
  limited: "bg-parchment text-bark",
  seasonal: "bg-cream text-stone border border-parchment",
};

type AvailabilityCardProps = {
  item: AvailabilityItem;
};

export function AvailabilityCard({ item }: AvailabilityCardProps) {
  return (
    <article className="card">
      <div className="image-frame relative aspect-[4/3]">
        {/* PHOTO: Replace with real product/listing photo for {item.name} */}
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="border-t border-parchment p-5">
        <span className={`chip ${statusStyles[item.status]}`}>
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
