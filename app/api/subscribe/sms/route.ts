import { NextResponse } from "next/server";
import { splitName, upsertContact } from "@/lib/contacts";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** @deprecated Use POST /api/contacts or /api/subscribe */
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

  const fullName =
    typeof payload.fullName === "string" ? payload.fullName : "";
  const names = fullName ? splitName(fullName) : { firstName: "", lastName: "" };

  const result = await upsertContact({
    firstName: names.firstName,
    lastName: names.lastName,
    phone: typeof payload.phone === "string" ? payload.phone : "",
    smsOptIn: payload.consentSms === true,
    source: typeof payload.source === "string" ? payload.source : "sms_signup",
    tags: ["sms_interest"],
    activityType: "sms_opted_in",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, status: result.status });
}
