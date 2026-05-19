import { site } from "@/lib/content";
import { googleMapsUrl } from "@/lib/location";

type LocationBlockProps = {
  showVisitNote?: boolean;
  className?: string;
};

export function LocationBlock({
  showVisitNote = true,
  className = "",
}: LocationBlockProps) {
  const { street, city, state } = site.address;

  return (
    <div className={className}>
      <h2 className="font-serif text-2xl text-bark">Location</h2>
      <address className="mt-4 not-italic text-base leading-relaxed text-stone">
        <span className="block text-bark">{street}</span>
        <span className="block">
          {city}, {state}
        </span>
      </address>
      <a
        href={googleMapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-salmon-dark underline underline-offset-2"
      >
        Open in Google Maps
      </a>
      {showVisitNote ? (
        <p className="mt-4 text-sm text-stone">{site.visitNote}</p>
      ) : null}
    </div>
  );
}
