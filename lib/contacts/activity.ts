import type { SupabaseClient } from "@supabase/supabase-js";

export async function logContactActivity(
  supabase: SupabaseClient,
  input: {
    contactId: string;
    activityType: string;
    activityDetail?: string;
    source?: string;
  },
): Promise<void> {
  const { error } = await supabase.from("contact_activity").insert({
    contact_id: input.contactId,
    activity_type: input.activityType,
    activity_detail: input.activityDetail ?? null,
    source: input.source ?? null,
  });

  if (error) {
    console.error("[contact_activity]", error);
  }
}
