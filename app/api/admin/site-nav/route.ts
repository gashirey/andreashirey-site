import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";
import { getSiteNavItemsRaw } from "@/lib/site-cms/queries";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const nav = await getSiteNavItemsRaw();
  return NextResponse.json({ nav });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    label?: string;
    href?: string;
    sort_order?: number;
    is_visible?: boolean;
  };

  const label = body.label?.trim();
  const href = body.href?.trim();
  if (!label || !href) {
    return NextResponse.json(
      { error: "label and href are required." },
      { status: 400 },
    );
  }
  if (!href.startsWith("/")) {
    return NextResponse.json(
      { error: "href must start with /." },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_nav_items")
    .insert({
      label,
      href,
      sort_order: body.sort_order ?? 100,
      is_visible: body.is_visible ?? true,
    })
    .select()
    .single();

  if (error) {
    const hint =
      error.code === "PGRST205"
        ? " Run migration 012_site_cms.sql in Supabase."
        : "";
    return NextResponse.json(
      { error: `${error.message}${hint}` },
      { status: 400 },
    );
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ item: data });
}
