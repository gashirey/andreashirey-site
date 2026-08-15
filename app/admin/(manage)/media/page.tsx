import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-bark">Gallery</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-stone">
        Organize shoots, share client galleries, choose Work gallery photos, and
        place site images — each in its own tab.
      </p>
      <MediaLibrary />
    </div>
  );
}
