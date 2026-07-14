import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ContactRow } from "./types";

export async function listContacts(): Promise<ContactRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listContacts]", error);
    return [];
  }

  return (data ?? []) as ContactRow[];
}
