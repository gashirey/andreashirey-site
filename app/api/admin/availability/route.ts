import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { todayFarmDate } from "@/lib/inventory/date";
import { revalidateInventoryPaths } from "@/lib/inventory/revalidate";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? todayFarmDate();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_availability")
    .select(`*, product:farm_products (*)`)
    .eq("available_date", date)
    .order("display_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ date, availability: data });
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
  const availableDate =
    typeof body.available_date === "string"
      ? body.available_date
      : todayFarmDate();

  if (!productId) {
    return NextResponse.json({ error: "Product is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("farm_product_availability")
    .insert({
      product_id: productId,
      available_date: availableDate,
      status:
        body.status === "limited" ||
        body.status === "sold_out" ||
        body.status === "hidden"
          ? body.status
          : "available",
      bunch_price: Number(body.bunch_price) || 0,
      stems_per_bunch: Number(body.stems_per_bunch) || 10,
      bunches_available: Number(body.bunches_available) || 0,
      harvest_date:
        typeof body.harvest_date === "string" ? body.harvest_date : null,
      notes: typeof body.notes === "string" ? body.notes : null,
      display_order: Number(body.display_order) || 100,
      show_on_website: body.show_on_website !== false,
    })
    .select(`*, product:farm_products (*)`)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidateInventoryPaths();
  return NextResponse.json({ availability: data });
}
