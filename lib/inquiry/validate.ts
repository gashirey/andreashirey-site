import {
  commissionTypeOptions,
  investmentComfortOptions,
  preferredContactOptions,
  referralSourceOptions,
} from "./form-config";
import type { InquiryPayload } from "./types";

const commissionValues = new Set(commissionTypeOptions.map((o) => o.value));
const investmentValues = new Set(investmentComfortOptions.map((o) => o.value));
const contactValues = new Set(preferredContactOptions.map((o) => o.value));
const referralValues = new Set(referralSourceOptions.map((o) => o.value));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(
  raw: Record<string, unknown>,
): { ok: true; data: InquiryPayload } | { ok: false; error: string; fieldErrors?: Partial<Record<string, string>> } {
  const fieldErrors: Record<string, string> = {};

  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  const fullName = str("fullName");
  const email = str("email");
  const phone = str("phone");
  const commissionType = str("commissionType");
  const timeframe = str("timeframe");
  const location = str("location");
  const vision = str("vision");
  const connection = str("connection");
  const investmentComfort = str("investmentComfort");
  const referralSource = str("referralSource");
  const preferredContact = str("preferredContact");
  const source = str("source") || undefined;
  const campaign = str("campaign") || undefined;

  if (!fullName) fieldErrors.fullName = "Please enter your name.";
  if (!email) fieldErrors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email.";
  if (!phone) fieldErrors.phone = "Please enter a phone number.";
  if (!commissionType || !commissionValues.has(commissionType as never))
    fieldErrors.commissionType = "Please select a session type.";
  if (!timeframe) fieldErrors.timeframe = "Please share your timeframe.";
  if (!location) fieldErrors.location = "Please share a location.";
  if (!vision) fieldErrors.vision = "Please tell us what you're hoping to create.";
  if (!connection) fieldErrors.connection = "Please share what drew you to Andrea's work.";
  if (!investmentComfort || !investmentValues.has(investmentComfort as never))
    fieldErrors.investmentComfort = "Please select an option.";
  if (!referralSource || !referralValues.has(referralSource))
    fieldErrors.referralSource = "Please let us know how you found Andrea.";
  if (!preferredContact || !contactValues.has(preferredContact as never))
    fieldErrors.preferredContact = "Please select a contact method.";

  if (Object.keys(fieldErrors).length) {
    return {
      ok: false,
      error: "Please complete the required fields.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      commissionType: commissionType as InquiryPayload["commissionType"],
      timeframe,
      location,
      vision,
      connection,
      investmentComfort: investmentComfort as InquiryPayload["investmentComfort"],
      referralSource,
      preferredContact: preferredContact as InquiryPayload["preferredContact"],
      source,
      campaign,
    },
  };
}

export function formatInquiryNotes(data: InquiryPayload): string {
  const lines = [
    `Session type: ${data.commissionType}`,
    `Timeframe: ${data.timeframe}`,
    `Location: ${data.location}`,
    "",
    "Vision:",
    data.vision,
    "",
    "Connection:",
    data.connection,
    "",
    `Investment comfort: ${data.investmentComfort}`,
    `Referral: ${data.referralSource}`,
    `Preferred contact: ${data.preferredContact}`,
  ];
  if (data.source) lines.push(`Source: ${data.source}`);
  if (data.campaign) lines.push(`Campaign: ${data.campaign}`);
  return lines.join("\n");
}
