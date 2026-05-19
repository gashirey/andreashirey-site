import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { subscribeToMailingList } from "@/lib/subscribe/mailing";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Subscriptions are not configured yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  if (payload.website) {
    return NextResponse.json({ ok: true, status: "created" });
  }

  const email = typeof payload.email === "string" ? payload.email : "";
  const fullName =
    typeof payload.fullName === "string" ? payload.fullName : undefined;
  const source =
    typeof payload.source === "string" ? payload.source : undefined;

  const result = await subscribeToMailingList({ email, fullName, source });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status: result.status });
}
