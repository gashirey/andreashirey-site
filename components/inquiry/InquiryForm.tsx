"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormField } from "@/components/inquiry/FormField";
import { SelectField } from "@/components/inquiry/SelectField";
import { TextAreaField } from "@/components/inquiry/TextAreaField";
import { inquiryCopy } from "@/lib/inquiry/copy";
import {
  commissionTypeOptions,
  inquiryFields,
  investmentComfortOptions,
  preferredContactOptions,
  referralSourceOptions,
} from "@/lib/inquiry/form-config";

type FormStatus = "idle" | "loading" | "error";

export function InquiryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source") ?? "";
  const campaign = searchParams.get("campaign") ?? "";
  const typeParam = searchParams.get("type") ?? "";

  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const defaultCommission =
    commissionTypeOptions.some((o) => o.value === typeParam) ? typeParam : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFormError("");
    setFieldErrors({});

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setFormError(json.error ?? "Something went wrong. Please try again.");
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        return;
      }

      router.push("/inquire/confirmation");
    } catch {
      setStatus("error");
      setFormError("Something went wrong. Please try again or email directly.");
    }
  }

  const disabled = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="inquiry-form card p-6 md:p-10" noValidate>
      <p className="type-page-body mb-8 max-w-xl leading-relaxed text-stone">
        {inquiryCopy.intro}
      </p>

      <div className="grid gap-6 md:grid-cols-2 md:gap-x-8">
        <FormField
          id="fullName"
          label={inquiryFields.fullName.label}
          required
          error={fieldErrors.fullName}
        >
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            disabled={disabled}
            className="input"
          />
        </FormField>

        <FormField
          id="email"
          label={inquiryFields.email.label}
          required
          error={fieldErrors.email}
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={disabled}
            className="input"
          />
        </FormField>

        <FormField
          id="phone"
          label={inquiryFields.phone.label}
          required
          error={fieldErrors.phone}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            disabled={disabled}
            className="input"
          />
        </FormField>

        <SelectField
          id="commissionType"
          name="commissionType"
          label={inquiryFields.commissionType.label}
          required
          options={commissionTypeOptions}
          defaultValue={defaultCommission}
          disabled={disabled}
          error={fieldErrors.commissionType}
        />

        <FormField
          id="timeframe"
          label={inquiryFields.timeframe.label}
          required
          error={fieldErrors.timeframe}
        >
          <input
            id="timeframe"
            name="timeframe"
            type="text"
            required
            placeholder="e.g. Fall 2026, flexible"
            disabled={disabled}
            className="input"
          />
        </FormField>

        <FormField
          id="location"
          label={inquiryFields.location.label}
          required
          error={fieldErrors.location}
        >
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="City, region, or venue"
            disabled={disabled}
            className="input"
          />
        </FormField>
      </div>

      <div className="mt-6 space-y-6">
        <TextAreaField
          id="vision"
          name="vision"
          label={inquiryFields.vision.label}
          required
          rows={5}
          disabled={disabled}
          error={fieldErrors.vision}
        />

        <TextAreaField
          id="connection"
          name="connection"
          label={inquiryFields.connection.label}
          required
          rows={4}
          disabled={disabled}
          error={fieldErrors.connection}
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-x-8">
        <SelectField
          id="investmentComfort"
          name="investmentComfort"
          label={inquiryFields.investmentComfort.label}
          required
          options={investmentComfortOptions}
          disabled={disabled}
          error={fieldErrors.investmentComfort}
        />

        <SelectField
          id="referralSource"
          name="referralSource"
          label={inquiryFields.referralSource.label}
          required
          options={referralSourceOptions}
          disabled={disabled}
          error={fieldErrors.referralSource}
        />

        <SelectField
          id="preferredContact"
          name="preferredContact"
          label={inquiryFields.preferredContact.label}
          required
          options={preferredContactOptions}
          disabled={disabled}
          error={fieldErrors.preferredContact}
        />
      </div>

      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="campaign" value={campaign} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden
      />

      <div className="mt-10 border-t border-parchment pt-8">
        <button
          type="submit"
          disabled={disabled}
          className="btn w-full border-salmon-dark bg-salmon-dark text-white hover:bg-salmon disabled:opacity-60 md:w-auto md:min-w-[12rem]"
        >
          {status === "loading"
            ? inquiryCopy.submittingLabel
            : inquiryCopy.submitLabel}
        </button>

        {formError ? (
          <p className="mt-4 text-sm text-bark" role="alert">
            {formError}
          </p>
        ) : null}
      </div>
    </form>
  );
}
