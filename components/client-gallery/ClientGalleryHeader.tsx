import { site } from "@/lib/content";

type ClientGalleryHeaderProps = {
  title: string;
  shootName: string;
  shotOn: string | null;
  imageCount: number;
};

function formatShotDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ClientGalleryHeader({
  title,
  shootName,
  shotOn,
  imageCount,
}: ClientGalleryHeaderProps) {
  const formattedDate = formatShotDate(shotOn);
  const photoLabel = imageCount === 1 ? "1 photo" : `${imageCount} photos`;

  return (
    <header className="border-b border-parchment bg-white">
      <div className="mx-auto max-w-[88rem] px-6 py-8 lg:px-12 lg:py-10">
        <p className="text-xs uppercase tracking-[0.14em] text-stone">
          {site.brand}
        </p>
        <h1 className="type-page-title mt-3 max-w-3xl text-bark">{title}</h1>
        <p className="type-page-body mt-3 text-stone">
          {shootName}
          {formattedDate ? ` · ${formattedDate}` : ""}
          {imageCount ? ` · ${photoLabel}` : ""}
        </p>
      </div>
    </header>
  );
}
