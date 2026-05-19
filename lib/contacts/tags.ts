import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeTags } from "./normalize";

export async function ensureContactTags(
  supabase: SupabaseClient,
  contactId: string,
  tags: string[],
): Promise<void> {
  const normalized = normalizeTags(tags);
  if (!normalized.length) return;

  const rows = normalized.map((tag) => ({
    contact_id: contactId,
    tag,
  }));

  const { error } = await supabase
    .from("contact_tags")
    .upsert(rows, { onConflict: "contact_id,tag", ignoreDuplicates: true });

  if (error) {
    console.error("[contact_tags]", error);
  }
}
