import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { todayFarmDate } from "@/lib/inventory/date";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  let targetDate = todayFarmDate();
  try {
    const body = await request.json();
    if (typeof body?.available_date === "string") {
      targetDate = body.available_date;
    }
  } catch {
    // default to today
  }

  const supabase = createServiceClient();
  const { data: source, error: fetchError } = await supabase
    .from("farm_product_availability")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !source) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { id: _id, created_at: _c, updated_at: _u, ...rest } = source;

  const { data, error } = await supabase
    .from("farm_product_availability")
    .insert({
      ...rest,
      available_date: targetDate,
    })
    .select(`*, product:farm_products (*)`)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ availability: data });
}
