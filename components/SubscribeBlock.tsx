"use client";

import { useState } from "react";
import { subscribe } from "@/lib/content";

const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

type FormStatus = "idle" | "loading" | "success" | "error";

export function SubscribeBlock() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  if (!supabaseReady) {
    return (
      <div className="border border-parchment bg-site-surface p-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-site-green">
          {subscribe.heading}
        </p>
        <p className="mt-2 text-sm text-stone">{subscribe.notConfigured}</p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!emailOptIn && !smsOptIn) {
      setStatus("error");
      setMessage(subscribe.optInRequired);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          emailOptIn,
          smsOptIn,
          source: "footer",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(subscribe.success);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setEmailOptIn(false);
      setSmsOptIn(false);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const disabled = status === "loading" || status === "success";

  return (
    <div className="border border-parchment bg-site-surface p-5">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-site-green">
        {subscribe.heading}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-stone">{subscribe.description}</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="subscribe-first-name" className="sr-only">
              {subscribe.firstNameLabel}
            </label>
            <input
              id="subscribe-first-name"
              type="text"
              name="firstName"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={subscribe.firstNamePlaceholder}
              disabled={disabled}
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="subscribe-last-name" className="sr-only">
              {subscribe.lastNameLabel}
            </label>
            <input
              id="subscribe-last-name"
              type="text"
              name="lastName"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={subscribe.lastNamePlaceholder}
              disabled={disabled}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subscribe-email" className="sr-only">
            {subscribe.emailLabel}
          </label>
          <input
            id="subscribe-email"
            type="email"
            name="email"
            autoComplete="email"
            required={emailOptIn}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={subscribe.emailPlaceholder}
            disabled={disabled}
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="subscribe-phone" className="sr-only">
            {subscribe.phoneLabel}
          </label>
          <input
            id="subscribe-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            required={smsOptIn}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={subscribe.phonePlaceholder}
            disabled={disabled}
            className="input w-full"
          />
        </div>

        <fieldset className="space-y-2" disabled={disabled}>
          <legend className="sr-only">Communication preferences</legend>
          <label className="flex gap-2 text-xs leading-relaxed text-stone">
            <input
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="mt-0.5 shrink-0 rounded-sm border-parchment"
            />
            <span>{subscribe.emailOptIn}</span>
          </label>
          <label className="flex gap-2 text-xs leading-relaxed text-stone">
            <input
              type="checkbox"
              checked={smsOptIn}
              onChange={(e) => setSmsOptIn(e.target.checked)}
              className="mt-0.5 shrink-0 rounded-sm border-parchment"
            />
            <span>{subscribe.smsOptIn}</span>
          </label>
        </fieldset>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden
        />

        <button
          type="submit"
          disabled={disabled}
          className="btn w-full border-[var(--color-salmon-button)] bg-[var(--color-salmon-button)] text-white hover:border-[var(--color-salmon-button-hover)] hover:bg-[var(--color-salmon-button-hover)] disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Sending…" : subscribe.submitButton}
        </button>

        {message && (
          <p
            className={`text-sm ${status === "error" ? "text-bark" : "text-stone"}`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
