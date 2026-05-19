import { createServiceClient } from "@/lib/supabase/server";
import { logContactActivity } from "./activity";
import {
  formatFullName,
  mergeText,
  normalizeEmail,
  normalizePhoneE164,
  normalizeTags,
} from "./normalize";
import { ensureContactTags } from "./tags";
import type { ContactRow, UpsertContactInput, UpsertContactResult } from "./types";

function buildNameFields(input: UpsertContactInput) {
  const firstName = input.firstName?.trim() || "";
  const lastName = input.lastName?.trim() || "";
  const fullName =
    formatFullName(firstName, lastName) ||
    (firstName && !lastName ? firstName : null) ||
    null;

  return {
    first_name: firstName || null,
    last_name: lastName || null,
    full_name: fullName,
  };
}

function applyOptIns(
  existing: ContactRow | null,
  input: UpsertContactInput,
  now: string,
) {
  const emailOptIn = Boolean(input.emailOptIn);
  const smsOptIn = Boolean(input.smsOptIn);

  return {
    email_opt_in: existing?.email_opt_in || emailOptIn,
    sms_opt_in: existing?.sms_opt_in || smsOptIn,
    email_opt_in_at:
      emailOptIn && !existing?.email_opt_in_at
        ? now
        : existing?.email_opt_in_at ?? null,
    sms_opt_in_at:
      smsOptIn && !existing?.sms_opt_in_at
        ? now
        : existing?.sms_opt_in_at ?? null,
  };
}

async function flagConflictForReview(
  supabase: ReturnType<typeof createServiceClient>,
  emailRow: ContactRow,
  phoneRow: ContactRow,
  reason: string,
) {
  const reviewReason = reason;
  await supabase
    .from("contacts")
    .update({ needs_review: true, review_reason: reviewReason })
    .in("id", [emailRow.id, phoneRow.id]);
}

export async function upsertContact(
  input: UpsertContactInput,
): Promise<UpsertContactResult> {
  const email = input.email ? normalizeEmail(input.email) : null;
  const phone = input.phone ? normalizePhoneE164(input.phone) : null;

  if (!email && !phone) {
    return {
      ok: false,
      code: "validation",
      error: "Please provide an email address or phone number.",
    };
  }

  if (input.email && !email) {
    return {
      ok: false,
      code: "validation",
      error: "Please enter a valid email address.",
    };
  }

  if (input.phone && !phone) {
    return {
      ok: false,
      code: "validation",
      error: "Please enter a valid US mobile number (10 digits).",
    };
  }

  const isInquiry = input.activityType === "inquiry_received";

  if (!isInquiry && !input.emailOptIn && !input.smsOptIn) {
    return {
      ok: false,
      code: "validation",
      error: "Please opt in to email or text updates to continue.",
    };
  }

  if (isInquiry && !email) {
    return {
      ok: false,
      code: "validation",
      error: "Please enter a valid email address.",
    };
  }

  if (input.smsOptIn && !phone) {
    return {
      ok: false,
      code: "validation",
      error: "A mobile number is required for text updates.",
    };
  }

  if (input.emailOptIn && !email) {
    return {
      ok: false,
      code: "validation",
      error: "An email address is required for email updates.",
    };
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const names = buildNameFields(input);
  const tags = normalizeTags(input.tags);
  const source = input.source.trim() || "website";

  let emailRow: ContactRow | null = null;
  let phoneRow: ContactRow | null = null;

  if (email) {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) {
      console.error("[contacts] email lookup", error);
      return { ok: false, error: "Unable to save your information. Please try again." };
    }
    emailRow = data;
  }

  if (phone) {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (error) {
      console.error("[contacts] phone lookup", error);
      return { ok: false, error: "Unable to save your information. Please try again." };
    }
    phoneRow = data;
  }

  if (emailRow && phoneRow && emailRow.id !== phoneRow.id) {
    await flagConflictForReview(
      supabase,
      emailRow,
      phoneRow,
      "email_phone_conflict",
    );
    return {
      ok: false,
      code: "conflict",
      error:
        "We found a matching record that needs a quick review. Please email us directly and we'll help.",
    };
  }

  const existing = emailRow ?? phoneRow;
  const status: "created" | "updated" = existing ? "updated" : "created";
  const optIns = applyOptIns(existing, input, now);

  const row = {
    first_name: mergeText(existing?.first_name, names.first_name),
    last_name: mergeText(existing?.last_name, names.last_name),
    full_name: mergeText(existing?.full_name, names.full_name),
    email: email ?? existing?.email ?? null,
    phone: phone ?? existing?.phone ?? null,
    preferred_contact_method:
      input.preferredContactMethod ?? existing?.preferred_contact_method ?? null,
    ...optIns,
    source: existing?.source ?? source,
    customer_type: mergeText(existing?.customer_type, input.customerType),
    notes: mergeNotes(existing?.notes, input.notes),
  };

  let contactId: string;

  if (existing) {
    const { data, error } = await supabase
      .from("contacts")
      .update(row)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error) {
      console.error("[contacts] update", error);
      return { ok: false, error: "Unable to save your information. Please try again." };
    }
    contactId = data.id;
  } else {
    const { data, error } = await supabase
      .from("contacts")
      .insert({ ...row, source })
      .select("id")
      .single();

    if (error) {
      console.error("[contacts] insert", error);
      return { ok: false, error: "Unable to save your information. Please try again." };
    }
    contactId = data.id;
  }

  await ensureContactTags(supabase, contactId, tags);

  if (input.emailOptIn) {
    await ensureContactTags(supabase, contactId, ["email_interest", "newsletter"]);
  }
  if (input.smsOptIn) {
    await ensureContactTags(supabase, contactId, ["sms_interest"]);
  }

  await logContactActivity(supabase, {
    contactId,
    activityType: input.activityType ?? "form_submitted",
    activityDetail: input.activityDetail,
    source,
  });

  if (input.emailOptIn) {
    await logContactActivity(supabase, {
      contactId,
      activityType: "email_subscribed",
      source,
    });
  }
  if (input.smsOptIn) {
    await logContactActivity(supabase, {
      contactId,
      activityType: "sms_opted_in",
      source,
    });
  }

  return {
    ok: true,
    contactId,
    status,
    needsReview: existing?.needs_review,
  };
}

function mergeNotes(
  existing: string | null | undefined,
  incoming: string | null | undefined,
): string | null {
  const next = incoming?.trim();
  if (!next) return existing?.trim() || null;
  const prev = existing?.trim();
  if (!prev) return next;
  if (prev.includes(next)) return prev;
  return `${prev}\n\n${next}`;
}
