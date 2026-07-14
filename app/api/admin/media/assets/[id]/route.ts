import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "product-photos";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Props) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: asset, error: loadError } = await supabase
    .from("media_assets")
    .select("id, storage_path, public_url, filename")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 400 });
  }
  if (!asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  if (asset.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([asset.storage_path]);
    if (storageError) {
      console.error("[media asset DELETE storage]", storageError);
      // Still remove the DB row so it leaves the gallery even if storage delete fails.
    }
  }

  if (asset.public_url) {
    await supabase
      .from("site_hero_slides")
      .delete()
      .eq("image_url", asset.public_url);
    await supabase
      .from("site_media_slots")
      .delete()
      .eq("image_url", asset.public_url);
  }

  const { error: deleteError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");

  return NextResponse.json({
    ok: true,
    id,
    filename: asset.filename,
  });
}
