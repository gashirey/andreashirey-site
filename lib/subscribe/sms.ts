import { createServiceClient } from "@/lib/supabase/server";
import { normalizePhoneE164 } from "./validate";

export type SubscribeSmsResult =
  | { ok: true; status: "created" | "resubscribed" | "already_subscribed" }
  | { ok: false; error: string };

export async function subscribeToSmsList(input: {
  phone: string;
  fullName?: string;
  source?: string;
  consentSms: boolean;
}): Promise<SubscribeSmsResult> {
  if (!input.consentSms) {
    return {
      ok: false,
      error: "Please confirm you agree to receive text messages.",
    };
  }

  const phone = normalizePhoneE164(input.phone);
  if (!phone) {
    return {
      ok: false,
      error: "Please enter a valid US mobile number (10 digits).",
    };
  }

  const supabase = createServiceClient();
  const source = input.source ?? "website";
  const fullName = input.fullName?.trim() || null;

  const { data: existing, error: fetchError } = await supabase
    .from("sms_list")
    .select("id, unsubscribed_at")
    .eq("phone", phone)
    .maybeSingle();

  if (fetchError) {
    console.error("[sms_list] fetch", fetchError);
    return { ok: false, error: "Unable to save your number. Please try again." };
  }

  if (existing) {
    if (!existing.unsubscribed_at) {
      return { ok: true, status: "already_subscribed" };
    }

    const { error: updateError } = await supabase
      .from("sms_list")
      .update({
        unsubscribed_at: null,
        subscribed_at: new Date().toISOString(),
        consent_sms: true,
        full_name: fullName ?? undefined,
        source,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("[sms_list] resubscribe", updateError);
      return { ok: false, error: "Unable to save your number. Please try again." };
    }

    return { ok: true, status: "resubscribed" };
  }

  const { error: insertError } = await supabase.from("sms_list").insert({
    phone,
    full_name: fullName,
    source,
    consent_sms: true,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { ok: true, status: "already_subscribed" };
    }
    console.error("[sms_list] insert", insertError);
    return { ok: false, error: "Unable to save your number. Please try again." };
  }

  return { ok: true, status: "created" };
}
