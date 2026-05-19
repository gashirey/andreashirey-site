import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";

export type MailingListRow = {
  id: string;
  email: string;
  full_name: string | null;
  source: string;
  consent_email: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

export type SmsListRow = {
  id: string;
  phone: string;
  full_name: string | null;
  source: string;
  consent_sms: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
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
