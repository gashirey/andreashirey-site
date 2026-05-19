import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { slugify } from "@/lib/inventory/slug";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ product: data });
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

  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.slug === "string") updates.slug = slugify(body.slug);
  if (typeof body.category === "string") updates.category = body.category;
  if (typeof body.description === "string") {
    updates.description = body.description;
  }
  if (body.description === null) updates.description = null;
  if (typeof body.variety === "string") updates.variety = body.variety;
  if (body.variety === null) updates.variety = null;
  if (typeof body.color === "string") updates.color = body.color;
  if (body.color === null) updates.color = null;
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ product: data });
}
