import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (body.is_primary === true) {
    const { data: photo } = await supabase
      .from("farm_product_photos")
      .select("product_id, availability_id")
      .eq("id", id)
      .maybeSingle();

    if (photo) {
      let query = supabase
        .from("farm_product_photos")
        .update({ is_primary: false })
        .eq("product_id", photo.product_id);

      if (photo.availability_id) {
        query = query.eq("availability_id", photo.availability_id);
      } else {
        query = query.is("availability_id", null);
      }
      await query;
    }
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.alt_text === "string" || body.alt_text === null) {
    updates.alt_text = body.alt_text;
  }
  if (body.display_order !== undefined) {
    updates.display_order = Number(body.display_order);
  }
  if (typeof body.is_primary === "boolean") {
    updates.is_primary = body.is_primary;
  }

  const { data, error } = await supabase
    .from("farm_product_photos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ photo: data });
}

export async function DELETE(request: Request, { params }: Params) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("farm_product_photos")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
