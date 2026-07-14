import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-bark">Media & Work gallery</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-stone">
        See what&apos;s live on the Work gallery, add photos by shoot, and remove
        anything that shouldn&apos;t be public.
      </p>
      <MediaLibrary />
    </div>
  );
}
