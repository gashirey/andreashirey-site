import type {
  CommissionType,
  InvestmentComfort,
  PreferredContact,
} from "./types";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export const commissionTypeOptions: SelectOption<CommissionType>[] = [
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "family", label: "Family" },
  { value: "branding", label: "Branding / Editorial" },
  { value: "other", label: "Other" },
];

export const investmentComfortOptions: SelectOption<InvestmentComfort>[] = [
  { value: "exploring", label: "I'm exploring" },
  {
    value: "premium",
    label: "I understand this is a premium/custom experience",
  },
  {
    value: "ready",
    label: "I'm ready to discuss a full commission",
  },
];

export const preferredContactOptions: SelectOption<PreferredContact>[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either is fine" },
];

export const referralSourceOptions: SelectOption[] = [
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Referral from a friend or colleague" },
  { value: "search", label: "Web search" },
  { value: "vendor", label: "Vendor or planner" },
  { value: "past_client", label: "Past client" },
  { value: "other", label: "Other" },
];

/** Field metadata for labels and validation messages */
export const inquiryFields = {
  fullName: { label: "Full name", required: true },
  email: { label: "Email", required: true },
  phone: { label: "Phone", required: true },
  commissionType: { label: "Type of commission", required: true },
  timeframe: { label: "Desired timeframe / date", required: true },
  location: { label: "Location", required: true },
  vision: { label: "Tell us what you're hoping to create", required: true },
  connection: {
    label: "What drew you to Andrea's work?",
    required: true,
  },
  investmentComfort: {
    label: "Estimated investment comfort",
    required: true,
  },
  referralSource: { label: "How did you hear about Andrea?", required: true },
  preferredContact: { label: "Preferred contact method", required: true },
} as const;
