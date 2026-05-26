import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-bark">Media library</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-stone">
        Upload a full shoot in bulk. New images appear on the public Work
        gallery automatically, then you can feature selected frames across the site.
      </p>
      <MediaLibrary />
    </div>
  );
}
