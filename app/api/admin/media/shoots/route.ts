import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

type ShootRow = {
  id: string;
  name: string;
  shot_on: string | null;
  created_at: string;
};

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("media_shoots")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const shoots = (data ?? []) as ShootRow[];
  const shootIds = shoots.map((s) => s.id);

  const counts = new Map<
    string,
    { asset_count: number; in_gallery_count: number; client_gallery_count: number }
  >();
  for (const id of shootIds) {
    counts.set(id, {
      asset_count: 0,
      in_gallery_count: 0,
      client_gallery_count: 0,
    });
  }

  if (shootIds.length) {
    const [{ data: assets }, { data: galleries }] = await Promise.all([
      supabase
        .from("media_assets")
        .select("shoot_id, in_gallery")
        .in("shoot_id", shootIds),
      supabase
        .from("client_galleries")
        .select("shoot_id, is_published")
        .in("shoot_id", shootIds),
    ]);

    for (const asset of assets ?? []) {
      const shootId = asset.shoot_id as string | null;
      if (!shootId) continue;
      const entry = counts.get(shootId);
      if (!entry) continue;
      entry.asset_count += 1;
      if (asset.in_gallery) entry.in_gallery_count += 1;
    }

    for (const gallery of galleries ?? []) {
      const shootId = gallery.shoot_id as string;
      const entry = counts.get(shootId);
      if (!entry) continue;
      entry.client_gallery_count += 1;
    }
  }

  return NextResponse.json({
    shoots: shoots.map((shoot) => ({
      ...shoot,
      ...(counts.get(shoot.id) ?? {
        asset_count: 0,
        in_gallery_count: 0,
        client_gallery_count: 0,
      }),
    })),
  });
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json()) as { name?: string; shot_on?: string | null };
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("media_shoots")
    .insert({
      name,
      shot_on: body.shot_on || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    shoot: {
      ...data,
      asset_count: 0,
      in_gallery_count: 0,
      client_gallery_count: 0,
    },
  });
}
