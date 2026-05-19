import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";

export type ContactRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  preferred_contact_method: "email" | "sms" | "either" | null;
  email_opt_in: boolean;
  sms_opt_in: boolean;
  email_opt_in_at: string | null;
  sms_opt_in_at: string | null;
  source: string;
  customer_type: string | null;
  notes: string | null;
  needs_review: boolean;
  review_reason: string | null;
  created_at: string;
  updated_at: string;
};

export function createServiceClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
