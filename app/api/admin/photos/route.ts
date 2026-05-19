import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  const availabilityId = searchParams.get("availability_id");

  if (!productId) {
    return NextResponse.json({ error: "product_id required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  let query = supabase
    .from("farm_product_photos")
    .select("*")
    .eq("product_id", productId)
    .order("display_order");

  if (availabilityId) {
    query = query.eq("availability_id", availabilityId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ photos: data });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const productId = typeof body.product_id === "string" ? body.product_id : "";
  const imageUrl = typeof body.image_url === "string" ? body.image_url : "";

  if (!productId || !imageUrl) {
    return NextResponse.json(
      { error: "product_id and image_url are required." },
      { status: 400 },
    );
  }

  const availabilityId =
    typeof body.availability_id === "string" ? body.availability_id : null;

  const supabase = createServiceClient();

  if (body.is_primary === true) {
    await clearPrimary(supabase, productId, availabilityId);
  }

  const { data, error } = await supabase
    .from("farm_product_photos")
    .insert({
      product_id: productId,
      availability_id: availabilityId,
      image_url: imageUrl,
      alt_text: typeof body.alt_text === "string" ? body.alt_text : null,
      is_primary: body.is_primary === true,
      display_order: Number(body.display_order) || 100,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ photo: data });
}

async function clearPrimary(
  supabase: ReturnType<typeof createServiceClient>,
  productId: string,
  availabilityId: string | null,
) {
  let query = supabase
    .from("farm_product_photos")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (availabilityId) {
    query = query.eq("availability_id", availabilityId);
  } else {
    query = query.is("availability_id", null);
  }

  await query;
}
