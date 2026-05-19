import { redirect } from "next/navigation";

/** Gallery hidden for now — send visitors home */
export default function GalleryPage() {
  redirect("/");
}
