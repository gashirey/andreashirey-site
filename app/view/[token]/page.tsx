import { notFound } from "next/navigation";
import { ClientGalleryView } from "@/components/client-gallery/ClientGalleryView";
import { getClientGalleryView } from "@/lib/client-gallery/queries";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const view = await getClientGalleryView(token);

  if (!view) {
    return pageMetadata({
      title: "Gallery unavailable",
      description: "This client gallery link is invalid or has expired.",
      path: `/view/${token}`,
    });
  }

  return pageMetadata({
    title: view.gallery.title,
    description: `Client gallery — ${view.shootName}.`,
    path: `/view/${token}`,
  });
}

export default async function ClientGalleryPage({ params }: PageProps) {
  const { token } = await params;
  const view = await getClientGalleryView(token);

  if (!view) notFound();

  return <ClientGalleryView view={view} />;
}
