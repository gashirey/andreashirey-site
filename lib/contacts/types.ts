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

export type UpsertContactInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emailOptIn?: boolean;
  smsOptIn?: boolean;
  preferredContactMethod?: "email" | "sms" | "either";
  source: string;
  customerType?: string;
  notes?: string;
  tags?: string[];
  activityType?: string;
  activityDetail?: string;
};

export type UpsertContactResult =
  | {
      ok: true;
      contactId: string;
      status: "created" | "updated";
      needsReview?: boolean;
    }
  | { ok: false; error: string; code?: "conflict" | "validation" };

export const CONTACT_TAGS = [
  "wedding_inquiry",
  "farm_event",
  "flowers",
  "newsletter",
  "photography",
  "vendor",
  "local_customer",
  "sms_interest",
  "email_interest",
] as const;

export type ContactTag = (typeof CONTACT_TAGS)[number];
