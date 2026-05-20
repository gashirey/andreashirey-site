import { SocialMediaWorkbench } from "@/components/admin/SocialMediaWorkbench";

export const metadata = {
  title: "Social — Grey Gables Admin",
};

export default function AdminSocialPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-bark">Social</h1>
      <p className="mt-1 mb-4 text-sm text-stone">
        Phone-friendly: save library and product photos, copy captions, post in
        Instagram.
      </p>
      <SocialMediaWorkbench />
    </div>
  );
}
