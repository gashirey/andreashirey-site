import { createServiceClient } from "@/lib/supabase/server";
import { normalizeEmail } from "./validate";

export type SubscribeMailingResult =
  | { ok: true; status: "created" | "resubscribed" | "already_subscribed" }
  | { ok: false; error: string };

export async function subscribeToMailingList(input: {
  email: string;
  fullName?: string;
  source?: string;
}): Promise<SubscribeMailingResult> {
  const email = normalizeEmail(input.email);
  if (!email) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const supabase = createServiceClient();
  const source = input.source ?? "website";
  const fullName = input.fullName?.trim() || null;

  const { data: existing, error: fetchError } = await supabase
    .from("mailing_list")
    .select("id, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  if (fetchError) {
    console.error("[mailing_list] fetch", fetchError);
    return { ok: false, error: "Unable to save your email. Please try again." };
  }

  if (existing) {
    if (!existing.unsubscribed_at) {
      return { ok: true, status: "already_subscribed" };
    }

    const { error: updateError } = await supabase
      .from("mailing_list")
      .update({
        unsubscribed_at: null,
        subscribed_at: new Date().toISOString(),
        consent_email: true,
        full_name: fullName ?? undefined,
        source,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("[mailing_list] resubscribe", updateError);
      return { ok: false, error: "Unable to save your email. Please try again." };
    }

    return { ok: true, status: "resubscribed" };
  }

  const { error: insertError } = await supabase.from("mailing_list").insert({
    email,
    full_name: fullName,
    source,
    consent_email: true,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return { ok: true, status: "already_subscribed" };
    }
    console.error("[mailing_list] insert", insertError);
    return { ok: false, error: "Unable to save your email. Please try again." };
  }

  return { ok: true, status: "created" };
}
