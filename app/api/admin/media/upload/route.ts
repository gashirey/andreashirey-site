import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { uploadImageToStorage } from "@/lib/admin/storage-upload";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_FILES = 50;
const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const formData = await request.formData();
  const shootId = formData.get("shoot_id");
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Upload at most ${MAX_FILES} files at a time.` },
      { status: 400 },
    );
  }

  const tooLarge = files.find((f) => f.size > MAX_BYTES);
  if (tooLarge) {
    return NextResponse.json(
      { error: `${tooLarge.name} exceeds 15MB.` },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  let shootPrefix = "library/unsorted";

  if (typeof shootId === "string" && shootId) {
    const { data: shoot } = await supabase
      .from("media_shoots")
      .select("id, name")
      .eq("id", shootId)
      .maybeSingle();

    if (!shoot) {
      return NextResponse.json({ error: "Shoot not found." }, { status: 400 });
    }

    const slug = shoot.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    shootPrefix = `library/${slug || shoot.id}`;
  }

  const uploaded: { filename: string; public_url: string; id?: string }[] = [];
  const errors: { filename: string; error: string }[] = [];

  for (const file of files) {
    const result = await uploadImageToStorage(file, shootPrefix);
    if ("error" in result) {
      errors.push({ filename: file.name, error: result.error });
      continue;
    }

    const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

    const { data, error } = await supabase
      .from("media_assets")
      .insert({
        shoot_id: typeof shootId === "string" && shootId ? shootId : null,
        storage_path: result.path,
        public_url: result.imageUrl,
        filename: file.name,
        alt_text: alt,
      })
      .select("id, public_url, filename")
      .single();

    if (error) {
      errors.push({ filename: file.name, error: error.message });
      continue;
    }

    uploaded.push({
      filename: data.filename,
      public_url: data.public_url,
      id: data.id,
    });
  }

  return NextResponse.json({
    uploaded,
    errors,
    message:
      errors.length === 0
        ? `Uploaded ${uploaded.length} file(s).`
        : `Uploaded ${uploaded.length}, ${errors.length} failed.`,
  });
}
