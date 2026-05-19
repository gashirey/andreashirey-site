import { NextResponse } from "next/server";
import { upsertContact } from "@/lib/contacts";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function bool(value: unknown): boolean {
  return value === true;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Contact storage is not configured yet." },
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

  const tags = Array.isArray(payload.tags)
    ? payload.tags.filter((t): t is string => typeof t === "string")
    : undefined;

  const result = await upsertContact({
    firstName: str(payload.firstName),
    lastName: str(payload.lastName),
    email: str(payload.email),
    phone: str(payload.phone),
    emailOptIn: bool(payload.emailOptIn),
    smsOptIn: bool(payload.smsOptIn),
    preferredContactMethod:
      payload.preferredContactMethod === "email" ||
      payload.preferredContactMethod === "sms" ||
      payload.preferredContactMethod === "either"
        ? payload.preferredContactMethod
        : undefined,
    source: str(payload.source) ?? "website",
    customerType: str(payload.customerType),
    notes: str(payload.notes),
    tags,
    activityType: str(payload.activityType),
    activityDetail: str(payload.activityDetail),
  });

  if (!result.ok) {
    const status = result.code === "conflict" ? 409 : 400;
    return NextResponse.json({ error: result.error, code: result.code }, { status });
  }

  return NextResponse.json({
    ok: true,
    contactId: result.contactId,
    status: result.status,
    needsReview: result.needsReview ?? false,
  });
}
