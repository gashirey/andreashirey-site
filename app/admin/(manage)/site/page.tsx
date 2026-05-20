import { SiteEditor } from "@/components/admin/SiteEditor";

export default function AdminSitePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bark">Site editor</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-stone">
        Change colors, wording, navigation, images, and how photos are cropped on
        the public site — without a developer. Run migration{" "}
        <code className="text-xs">012_site_cms.sql</code> in Supabase if settings
        fail to load.
      </p>
      <SiteEditor />
    </div>
  );
}
