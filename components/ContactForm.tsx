"use client";

import { useSearchParams } from "next/navigation";
import { site } from "@/lib/content";

const subjectLabels: Record<string, string> = {
  flowers: "Flower inquiry",
  wedding: "Wedding or event inquiry",
  general: "General question",
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const subjectKey = searchParams.get("subject") ?? "general";
  const defaultSubject = subjectLabels[subjectKey] ?? subjectLabels.general;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const subjectKey = String(form.get("subject") ?? "general");
    const message = String(form.get("message") ?? "");
    const subjectLabel = subjectLabels[subjectKey] ?? subjectLabels.general;

    const subject = encodeURIComponent(`${subjectLabel} — ${site.name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8">
      <p className="mb-6 text-sm text-stone">
        Submitting opens your email app with your message pre-filled. We
        typically reply within 2–3 business days.
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
            className="input mt-1"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-bark">
            Subject
          </label>
          <select id="subject" name="subject" defaultValue={subjectKey} className="input mt-1">
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
            placeholder={`Tell us about your ${defaultSubject.toLowerCase()}...`}
            className="input mt-1 resize-y"
          />
        </div>
        <button type="submit" className="btn w-full border-salmon-dark bg-salmon-dark text-white hover:bg-salmon">
          Send message
        </button>
      </div>
    </form>
  );
}
