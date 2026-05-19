import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-bark">Media library</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-stone">
        Upload your shoot in bulk, then assign images to the homepage hero, feature
        band, about page, or product cards. No terminal scripts required.
      </p>
      <MediaLibrary />
    </div>
  );
}
