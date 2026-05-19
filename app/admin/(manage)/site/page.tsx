import { SiteMediaEditor } from "@/components/admin/SiteMediaEditor";

export default function AdminSiteMediaPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bark">Site images</h1>
      <p className="mt-1 mb-6 max-w-xl text-sm text-stone">
        Hero, homepage feature band, and about photo. Upload from your shoot —
        changes go live on the public site immediately.
      </p>
      <SiteMediaEditor />
    </div>
  );
}
