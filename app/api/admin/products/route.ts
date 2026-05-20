import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { slugify } from "@/lib/inventory/slug";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_products")
    .select("*")
    .order("name");

  if (error) {
    console.error("[admin products GET]", error);
    return NextResponse.json(
      {
        products: [],
        error: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ products: data ?? [] });
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(name);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_products")
    .insert({
      name,
      slug,
      category:
        typeof body.category === "string" ? body.category : "flowers",
      description:
        typeof body.description === "string" ? body.description : null,
      variety: typeof body.variety === "string" ? body.variety : null,
      color: typeof body.color === "string" ? body.color : null,
      is_active: body.is_active !== false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ product: data });
}
