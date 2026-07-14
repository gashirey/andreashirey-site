import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_hero_slides")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    const hint =
      error.code === "PGRST205"
        ? " Run migration 010_site_hero_slides.sql in Supabase."
        : "";
    return NextResponse.json({ error: `${error.message}${hint}` }, { status: 400 });
  }

  return NextResponse.json({ slides: data ?? [] });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    image_url?: string;
    alt_text?: string | null;
    display_order?: number;
  };

  if (!body.image_url?.trim()) {
    return NextResponse.json({ error: "image_url is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_hero_slides")
    .insert({
      image_url: body.image_url.trim(),
      alt_text: body.alt_text?.trim() || null,
      display_order: body.display_order ?? 100,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");

  return NextResponse.json({ slide: data });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("site_hero_slides")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    const hint =
      error.code === "PGRST205"
        ? " Run migration 010_site_hero_slides.sql in Supabase."
        : "";
    return NextResponse.json({ error: `${error.message}${hint}` }, { status: 400 });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
