import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require";
import { listContacts } from "@/lib/contacts/list";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured.", contacts: [] },
      { status: 503 },
    );
  }

  const contacts = await listContacts();
  return NextResponse.json({ contacts });
}
