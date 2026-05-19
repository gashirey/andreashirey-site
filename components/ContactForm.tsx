"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/content";

const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

const subjectLabels: Record<string, string> = {
  flowers: "Flower inquiry",
  wedding: "Wedding or event inquiry",
  general: "General question",
};

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const searchParams = useSearchParams();
  const subjectKey = searchParams.get("subject") ?? "general";
  const defaultSubject = subjectLabels[subjectKey] ?? subjectLabels.general;

  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  function openMailto(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "general");
    const bodyText = String(data.get("message") ?? "");
    const subjectLabel = subjectLabels[subject] ?? subjectLabels.general;

    const subjectLine = encodeURIComponent(`${subjectLabel} — ${site.name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${bodyText}`,
    );

    window.location.href = `mailto:${site.email}?subject=${subjectLine}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!supabaseReady) {
      openMailto(form);
      return;
    }

    setStatus("loading");
    setMessage("");

    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("Thanks — we received your message and will reply within 2–3 business days.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again or email us directly.");
    }
  }

  const disabled = status === "loading" || status === "success";

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8">
      <p className="mb-6 text-sm text-stone">
        {supabaseReady
          ? "Send a message and we'll follow up within 2–3 business days."
          : "Submitting opens your email app with your message pre-filled. We typically reply within 2–3 business days."}
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-bark">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={disabled}
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-bark">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={disabled}
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-bark">
            Phone <span className="font-normal text-stone">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            disabled={disabled}
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-bark">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            defaultValue={subjectKey}
            disabled={disabled}
            className="input mt-1"
          >
            <option value="flowers">Flower inquiry</option>
            <option value="wedding">Wedding or event</option>
            <option value="general">General question</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-bark">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={disabled}
            placeholder={`Tell us about your ${defaultSubject.toLowerCase()}...`}
            className="input mt-1 resize-y"
          />
        </div>

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
          className="btn w-full border-salmon-dark bg-salmon-dark text-white hover:bg-salmon disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>

        {message ? (
          <p
            className={`text-sm ${status === "error" ? "text-bark" : "text-stone"}`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
