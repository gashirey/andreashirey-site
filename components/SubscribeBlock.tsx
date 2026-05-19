"use client";

import { useState } from "react";
import { subscribe } from "@/lib/content";

const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

type FormStatus = "idle" | "loading" | "success" | "error";

export function SubscribeBlock() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<FormStatus>("idle");
  const [smsStatus, setSmsStatus] = useState<FormStatus>("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

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

  async function submitMailing(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("loading");
    setEmailMessage("");

    try {
      const res = await fetch("/api/subscribe/mailing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEmailStatus("error");
        setEmailMessage(data.error ?? "Something went wrong.");
        return;
      }

      setEmailStatus("success");
      setEmailMessage(subscribe.emailSuccess);
      setEmail("");
    } catch {
      setEmailStatus("error");
      setEmailMessage("Something went wrong. Please try again.");
    }
  }

  async function submitSms(e: React.FormEvent) {
    e.preventDefault();
    setSmsStatus("loading");
    setSmsMessage("");

    try {
      const res = await fetch("/api/subscribe/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          consentSms: smsConsent,
          source: "footer",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSmsStatus("error");
        setSmsMessage(data.error ?? "Something went wrong.");
        return;
      }

      setSmsStatus("success");
      setSmsMessage(subscribe.smsSuccess);
      setPhone("");
      setSmsConsent(false);
    } catch {
      setSmsStatus("error");
      setSmsMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="border border-parchment bg-site-surface p-5">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-site-green">
        {subscribe.heading}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-stone">{subscribe.description}</p>

      <form onSubmit={submitMailing} className="mt-5 space-y-2">
        <label htmlFor="subscribe-email" className="sr-only">
          {subscribe.emailLabel}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="subscribe-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={subscribe.emailPlaceholder}
            disabled={emailStatus === "loading" || emailStatus === "success"}
            className="input min-w-0 flex-1"
          />
          <button
            type="submit"
            disabled={emailStatus === "loading" || emailStatus === "success"}
            className="btn shrink-0 border-[var(--color-salmon-button)] bg-[var(--color-salmon-button)] text-white hover:border-[var(--color-salmon-button-hover)] hover:bg-[var(--color-salmon-button-hover)] disabled:opacity-60"
          >
            {emailStatus === "loading" ? "Sending…" : subscribe.emailButton}
          </button>
        </div>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden
        />
        {emailMessage && (
          <p
            className={`text-sm ${emailStatus === "error" ? "text-bark" : "text-stone"}`}
            role={emailStatus === "error" ? "alert" : "status"}
          >
            {emailMessage}
          </p>
        )}
      </form>

      <form onSubmit={submitSms} className="mt-6 space-y-3 border-t border-parchment pt-5">
        <label htmlFor="subscribe-phone" className="block text-xs font-medium text-bark">
          {subscribe.smsLabel}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="subscribe-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={subscribe.smsPlaceholder}
            disabled={smsStatus === "loading" || smsStatus === "success"}
            className="input min-w-0 flex-1"
          />
          <button
            type="submit"
            disabled={smsStatus === "loading" || smsStatus === "success"}
            className="btn shrink-0 border-bark/25 bg-transparent text-bark hover:border-site-green hover:text-site-green disabled:opacity-60"
          >
            {smsStatus === "loading" ? "Sending…" : subscribe.smsButton}
          </button>
        </div>
        <label className="flex gap-2 text-xs leading-relaxed text-stone">
          <input
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            required
            className="mt-0.5 shrink-0 rounded-sm border-parchment"
          />
          <span>{subscribe.smsConsent}</span>
        </label>
        {smsMessage && (
          <p
            className={`text-sm ${smsStatus === "error" ? "text-bark" : "text-stone"}`}
            role={smsStatus === "error" ? "alert" : "status"}
          >
            {smsMessage}
          </p>
        )}
      </form>
    </div>
  );
}
