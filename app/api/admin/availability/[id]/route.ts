import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_availability")
    .select(`*, product:farm_products (*)`)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ availability: data });
}

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

  const updates: Record<string, unknown> = {};

  if (typeof body.available_date === "string") {
    updates.available_date = body.available_date;
  }
  if (
    body.status === "available" ||
    body.status === "limited" ||
    body.status === "sold_out" ||
    body.status === "hidden"
  ) {
    updates.status = body.status;
  }
  if (body.bunch_price !== undefined) {
    updates.bunch_price = Number(body.bunch_price);
  }
  if (body.stems_per_bunch !== undefined) {
    updates.stems_per_bunch = Number(body.stems_per_bunch);
  }
  if (body.bunches_available !== undefined) {
    updates.bunches_available = Number(body.bunches_available);
  }
  if (body.harvest_date === null || typeof body.harvest_date === "string") {
    updates.harvest_date = body.harvest_date;
  }
  if (body.notes === null || typeof body.notes === "string") {
    updates.notes = body.notes;
  }
  if (body.display_order !== undefined) {
    updates.display_order = Number(body.display_order);
  }
  if (typeof body.show_on_website === "boolean") {
    updates.show_on_website = body.show_on_website;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_availability")
    .update(updates)
    .eq("id", id)
    .select(`*, product:farm_products (*)`)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ availability: data });
}

export async function DELETE(request: Request, { params }: Params) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("farm_product_availability")
    .update({ status: "hidden", show_on_website: false })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
