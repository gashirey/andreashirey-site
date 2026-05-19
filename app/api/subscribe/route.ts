import { NextResponse } from "next/server";
import { upsertContact } from "@/lib/contacts";
import { isSupabaseConfigured } from "@/lib/supabase/config";

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
    return NextResponse.json({ ok: true });
  }

  const firstName =
    typeof payload.firstName === "string" ? payload.firstName : "";
  const lastName =
    typeof payload.lastName === "string" ? payload.lastName : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const phone = typeof payload.phone === "string" ? payload.phone : "";

  const hasExplicitOptIns =
    payload.emailOptIn !== undefined || payload.smsOptIn !== undefined;
  const resolvedEmailOptIn = hasExplicitOptIns
    ? payload.emailOptIn === true
    : payload.consent === true;
  const resolvedSmsOptIn = hasExplicitOptIns
    ? payload.smsOptIn === true
    : payload.consent === true;

  if (!resolvedEmailOptIn && !resolvedSmsOptIn) {
    return NextResponse.json(
      { error: "Please opt in to email or text updates to continue." },
      { status: 400 },
    );
  }

  const result = await upsertContact({
    firstName,
    lastName,
    email,
    phone,
    emailOptIn: resolvedEmailOptIn,
    smsOptIn: resolvedSmsOptIn,
    source:
      typeof payload.source === "string"
        ? payload.source === "footer"
          ? "newsletter_signup"
          : payload.source
        : "newsletter_signup",
    tags: ["newsletter"],
    activityType: "form_submitted",
    activityDetail: "footer_signup",
  });

  if (!result.ok) {
    const status = result.code === "conflict" ? 409 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({
    ok: true,
    contactId: result.contactId,
    status: result.status,
  });
}
