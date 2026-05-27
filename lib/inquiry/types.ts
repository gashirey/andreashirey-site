export type SessionType =
  | "wedding"
  | "portrait"
  | "family"
  | "branding"
  | "other";

export type InvestmentComfort =
  | "exploring"
  | "premium"
  | "ready";

export type PreferredContact = "email" | "phone" | "either";

export type InquiryPayload = {
  fullName: string;
  email: string;
  phone: string;
  commissionType: SessionType;
  timeframe: string;
  location: string;
  vision: string;
  connection: string;
  investmentComfort: InvestmentComfort;
  referralSource: string;
  preferredContact: PreferredContact;
  /** Hidden — campaign tracking */
  source?: string;
  campaign?: string;
};

export type InquirySubmitResult =
  | { ok: true; contactId?: string; status: "created" | "updated" | "logged" }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof InquiryPayload, string>> };
