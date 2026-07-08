import { notFound } from "next/navigation";
import { ClientGalleryPasswordGate } from "@/components/client-gallery/ClientGalleryPasswordGate";
import { ClientGalleryView } from "@/components/client-gallery/ClientGalleryView";
import { getClientGalleryPageState } from "@/lib/client-gallery/queries";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  const state = await getClientGalleryPageState(token);

  if (state.status === "not_found") {
    return pageMetadata({
      title: "Gallery unavailable",
      description: "This client gallery link is invalid or has expired.",
      path: `/view/${token}`,
    });
  }

  const title = state.view.gallery.title;
  const shootName = state.view.shootName;

  return pageMetadata({
    title,
    description: `Client gallery — ${shootName}.`,
    path: `/view/${token}`,
  });
}

export default async function ClientGalleryPage({ params }: PageProps) {
  const { token } = await params;
  const state = await getClientGalleryPageState(token);

  if (state.status === "not_found") notFound();

  if (state.status === "locked") {
    return (
      <ClientGalleryPasswordGate
        token={token}
        title={state.view.gallery.title}
        shootName={state.view.shootName}
      />
    );
  }

  return <ClientGalleryView view={state.view} />;
}
