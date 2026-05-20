import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { createServiceClient } from "@/lib/supabase/server";

function safeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80);
  return base.includes(".") ? base : `${base || "image"}.jpg`;
}

/** Proxy download so phones can save library / product images to Photos. */
export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");

  if (!id || (kind !== "media" && kind !== "product")) {
    return NextResponse.json(
      { error: "kind and id required (kind=media|product)." },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  let imageUrl: string | null = null;
  let filename = "grey-gables.jpg";

  if (kind === "media") {
    const { data, error } = await supabase
      .from("media_assets")
      .select("public_url, filename")
      .eq("id", id)
      .maybeSingle();

    if (error || !data?.public_url) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }
    imageUrl = data.public_url;
    filename = safeFilename(data.filename);
  } else {
    const { data, error } = await supabase
      .from("farm_product_photos")
      .select("image_url, alt_text, product_id")
      .eq("id", id)
      .maybeSingle();

    if (error || !data?.image_url) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    imageUrl = data.image_url;
    const { data: product } = await supabase
      .from("farm_products")
      .select("slug")
      .eq("id", data.product_id)
      .maybeSingle();

    filename = safeFilename(
      product?.slug ?? data.alt_text ?? `product-${id.slice(0, 8)}`,
    );
  }

  const url = imageUrl as string;

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Could not fetch image." },
        { status: 502 },
      );
    }

    const bytes = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed." }, { status: 502 });
  }
}
