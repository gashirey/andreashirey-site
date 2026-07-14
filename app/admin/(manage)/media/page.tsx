import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-bark">Media & Work gallery</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-stone">
        Upload into the library, then check which photos appear on the public
        Work gallery. Unchecking hides them without deleting.
      </p>
      <MediaLibrary />
    </div>
  );
}
