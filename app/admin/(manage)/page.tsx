import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-bark">Dashboard</h1>
        <p className="mt-1 text-sm text-stone">
          Portfolio updates, media, and site settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/media"
          className="border border-parchment bg-white p-5 hover:border-bark/30"
        >
          <p className="font-medium text-bark">Upload gallery images</p>
          <p className="mt-1 text-sm text-stone">
            Bulk upload a shoot; new images appear on the Work gallery.
          </p>
        </Link>
        <Link
          href="/admin/social"
          className="border border-parchment bg-white p-5 hover:border-bark/30"
        >
          <p className="font-medium text-bark">Social (phone)</p>
          <p className="mt-1 text-sm text-stone">
            Save images and copy captions for Instagram from your library.
          </p>
        </Link>
        <Link
          href="/admin/site"
          className="border border-parchment bg-white p-5 hover:border-bark/30"
        >
          <p className="font-medium text-bark">Site editor</p>
          <p className="mt-1 text-sm text-stone">
            Colors, menu, copy, images, and photo framing — no code changes.
          </p>
        </Link>
        <Link
          href="/gallery"
          className="border border-parchment bg-white p-5 hover:border-bark/30"
        >
          <p className="font-medium text-bark">Public gallery</p>
          <p className="mt-1 text-sm text-stone">Preview what visitors see.</p>
        </Link>
      </div>
    </div>
  );
}
