import { site } from "@/lib/content";
import { formatLocationLine, googleMapsUrl } from "@/lib/location";

type LocationBlockProps = {
  className?: string;
};

export function LocationBlock({ className = "" }: LocationBlockProps) {
  const mapsUrl = googleMapsUrl();
  const line = formatLocationLine();

  if (!line) return null;

  return (
    <div className={className}>
      <h2 className="font-serif text-2xl text-bark">Location</h2>
      <p className="mt-4 text-base leading-relaxed text-stone">{line}</p>
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-salmon-dark underline underline-offset-2"
        >
          Open in Google Maps
        </a>
      ) : null}
      {site.visitNote ? (
        <p className="mt-4 text-sm text-stone">{site.visitNote}</p>
      ) : null}
    </div>
  );
}
