import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json()) as {
    label?: string;
    href?: string;
    sort_order?: number;
    is_visible?: boolean;
  };

  if (body.href != null && !body.href.trim().startsWith("/")) {
    return NextResponse.json(
      { error: "href must start with /." },
      { status: 400 },
    );
  }

  const patch: Record<string, unknown> = {};
  if (body.label != null) patch.label = body.label.trim();
  if (body.href != null) patch.href = body.href.trim();
  if (body.sort_order != null) patch.sort_order = body.sort_order;
  if (body.is_visible != null) patch.is_visible = body.is_visible;

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "No fields to update." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_nav_items")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request, { params }: Props) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("site_nav_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
