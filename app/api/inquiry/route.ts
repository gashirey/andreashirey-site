import { NextResponse } from "next/server";
import { splitName, upsertContact } from "@/lib/contacts";
import { formatInquiryNotes, validateInquiry } from "@/lib/inquiry/validate";
import type { CommissionType } from "@/lib/inquiry/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const COMMISSION_TAGS: Record<CommissionType, string[]> = {
  wedding: ["wedding_inquiry", "photography"],
  portrait: ["photography"],
  family: ["photography"],
  branding: ["photography", "vendor"],
  other: ["photography"],
};

const PREFERRED_CONTACT_MAP = {
  email: "email",
  phone: "sms",
  either: "either",
} as const;

export async function POST(request: Request) {
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

  const validated = validateInquiry(payload);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error, fieldErrors: validated.fieldErrors },
      { status: 400 },
    );
  }

  const data = validated.data;
  const notes = formatInquiryNotes(data);
  const activityDetail = JSON.stringify({
    type: "commission_inquiry",
    commissionType: data.commissionType,
    investmentComfort: data.investmentComfort,
    referralSource: data.referralSource,
    source: data.source,
    campaign: data.campaign,
    /** TODO: consultation scheduler + Stripe payment status */
    consultationStatus: "pending_review",
  });

  if (!isSupabaseConfigured()) {
    // TODO: email notification (Resend/SendGrid) + admin review dashboard
    console.info("[inquiry:received]", {
      email: data.email,
      commissionType: data.commissionType,
      source: data.source,
    });
    return NextResponse.json({ ok: true, status: "logged" });
  }

  const { firstName, lastName } = splitName(data.fullName);

  const result = await upsertContact({
    firstName,
    lastName,
    email: data.email,
    phone: data.phone,
    emailOptIn: false,
    smsOptIn: false,
    preferredContactMethod: PREFERRED_CONTACT_MAP[data.preferredContact],
    source: data.source ? `inquiry:${data.source}` : "website_inquiry_form",
    customerType: data.commissionType,
    notes,
    tags: COMMISSION_TAGS[data.commissionType],
    activityType: "inquiry_received",
    activityDetail,
  });

  if (!result.ok) {
    const status = result.code === "conflict" ? 409 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  // TODO: trigger email notification to Andrea + optional auto-reply

  return NextResponse.json({
    ok: true,
    contactId: result.contactId,
    status: result.status,
  });
}
