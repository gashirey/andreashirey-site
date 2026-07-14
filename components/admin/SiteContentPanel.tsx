"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { mergeSiteCopy } from "@/lib/site-cms/merge";
import type { SiteContentOverrides, SiteSettingsRow } from "@/lib/site-cms/types";

export function SiteContentPanel() {
  const [draft, setDraft] = useState({
    tagline: "",
    description: "",
    heroTitle: "",
    heroSubtitle: "",
    heroCtaLabel: "",
    heroCtaHref: "",
    aboutEyebrow: "",
    aboutTitle: "",
    aboutParagraphs: "",
    selectedWorkTitle: "",
    selectedWorkDescription: "",
    featuredGalleryTitle: "",
    featuredGalleryDescription: "",
    ctaNote: "",
    ctaContact: "",
    announcementEnabled: false,
    announcementMessage: "",
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [setupError, setSetupError] = useState("");

  const syncDraft = useCallback((content: SiteContentOverrides) => {
    const merged = mergeSiteCopy(content);
    setDraft({
      tagline: merged.site.tagline,
      description: merged.site.description,
      heroTitle: merged.heroHome.title,
      heroSubtitle: merged.heroHome.subtitle,
      heroCtaLabel: merged.heroHome.primaryCta.label,
      heroCtaHref: merged.heroHome.primaryCta.href,
      aboutEyebrow: merged.aboutPage.eyebrow,
      aboutTitle: merged.aboutPage.title,
      aboutParagraphs: merged.aboutPage.paragraphs.join("\n\n"),
      selectedWorkTitle: merged.homeSections.selectedWork.title,
      selectedWorkDescription: merged.homeSections.selectedWork.description,
      featuredGalleryTitle: merged.homeSections.featuredGallery.title,
      featuredGalleryDescription:
        merged.homeSections.featuredGallery.description,
      ctaNote: merged.homeCta.note,
      ctaContact: merged.homeCta.contact,
      announcementEnabled: merged.announcement.enabled,
      announcementMessage: merged.announcement.message,
    });
  }, []);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/site-cms");
    const data = await res.json();
    if (!res.ok) {
      setSetupError(data.error ?? "Could not load site content.");
      return;
    }
    const settings = data.settings as SiteSettingsRow;
    syncDraft(settings.content_overrides ?? {});
    setSetupError("");
  }, [syncDraft]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setSaving(true);
    setNotice(null);

    const content_overrides: SiteContentOverrides = {
      site: {
        tagline: draft.tagline.trim() || undefined,
        description: draft.description.trim() || undefined,
      },
      heroHome: {
        title: draft.heroTitle.trim() || undefined,
        subtitle: draft.heroSubtitle.trim() || undefined,
        primaryCtaLabel: draft.heroCtaLabel.trim() || undefined,
        primaryCtaHref: draft.heroCtaHref.trim() || undefined,
      },
      homeAbout: draft.aboutParagraphs.trim()
        ? draft.aboutParagraphs.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
        : undefined,
      aboutPage: {
        eyebrow: draft.aboutEyebrow.trim() || undefined,
        title: draft.aboutTitle.trim() || undefined,
        paragraphs: draft.aboutParagraphs.trim()
          ? draft.aboutParagraphs
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean)
          : undefined,
      },
      homeSections: {
        selectedWork: {
          title: draft.selectedWorkTitle.trim() || undefined,
          description: draft.selectedWorkDescription.trim() || undefined,
        },
        featuredGallery: {
          title: draft.featuredGalleryTitle.trim() || undefined,
          description: draft.featuredGalleryDescription.trim() || undefined,
        },
      },
      homeCta: {
        note: draft.ctaNote.trim() || undefined,
        contact: draft.ctaContact.trim() || undefined,
      },
      announcement: {
        enabled: draft.announcementEnabled,
        message: draft.announcementMessage.trim() || undefined,
      },
    };

    const res = await fetch("/api/admin/site-cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_overrides }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setNotice({ type: "error", message: data.error ?? "Save failed." });
      return;
    }

    syncDraft((data.settings as SiteSettingsRow).content_overrides ?? {});
    setNotice({ type: "success", message: "Copy saved." });
  }

  if (setupError) {
    return <p className="text-sm text-bark">{setupError}</p>;
  }

  return (
    <div className="space-y-8">
      {notice && (
        <AdminNotice type={notice.type} message={notice.message} onDismiss={() => setNotice(null)} />
      )}

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">Announcement bar</h2>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.announcementEnabled}
            onChange={(e) =>
              setDraft({ ...draft, announcementEnabled: e.target.checked })
            }
          />
          Show announcement on every page
        </label>
        <label className="mt-4 block text-sm">
          Message
          <input
            type="text"
            className="input mt-1 w-full max-w-xl"
            value={draft.announcementMessage}
            onChange={(e) =>
              setDraft({ ...draft, announcementMessage: e.target.value })
            }
          />
        </label>
      </section>

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">Site tagline</h2>
        <div className="mt-4 grid gap-4 max-w-xl">
          <label className="text-sm">
            Tagline
            <input
              className="input mt-1 w-full"
              value={draft.tagline}
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Short description (footer)
            <textarea
              className="input mt-1 w-full"
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">Homepage hero text</h2>
        <div className="mt-4 grid gap-4 max-w-xl">
          <label className="text-sm">
            Headline
            <input
              className="input mt-1 w-full"
              value={draft.heroTitle}
              onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Subtitle
            <input
              className="input mt-1 w-full"
              value={draft.heroSubtitle}
              onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Button label
              <input
                className="input mt-1 w-full"
                value={draft.heroCtaLabel}
                onChange={(e) =>
                  setDraft({ ...draft, heroCtaLabel: e.target.value })
                }
              />
            </label>
            <label className="text-sm">
              Button link
              <input
                className="input mt-1 w-full font-mono text-xs"
                value={draft.heroCtaHref}
                onChange={(e) =>
                  setDraft({ ...draft, heroCtaHref: e.target.value })
                }
              />
            </label>
          </div>
        </div>
      </section>

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">About page</h2>
        <p className="mt-1 text-sm text-stone">
          Copy for{" "}
          <a href="/about" className="underline hover:text-bark">
            /about
          </a>
          . Manage the photo under Images & framing or Media → Currently on the
          site.
        </p>
        <div className="mt-4 grid gap-4 max-w-xl">
          <label className="text-sm">
            Eyebrow
            <input
              className="input mt-1 w-full"
              value={draft.aboutEyebrow}
              onChange={(e) =>
                setDraft({ ...draft, aboutEyebrow: e.target.value })
              }
            />
          </label>
          <label className="text-sm">
            Title
            <input
              className="input mt-1 w-full"
              value={draft.aboutTitle}
              onChange={(e) =>
                setDraft({ ...draft, aboutTitle: e.target.value })
              }
            />
          </label>
        </div>
        <label className="mt-4 block text-sm">
          Paragraphs (blank line between paragraphs)
          <textarea
            className="input mt-1 w-full max-w-2xl"
            rows={8}
            value={draft.aboutParagraphs}
            onChange={(e) =>
              setDraft({ ...draft, aboutParagraphs: e.target.value })
            }
          />
        </label>
      </section>

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">Legacy homepage sections</h2>
        <p className="mt-1 text-xs text-stone">
          Unused on the current homepage; kept for older content overrides.
        </p>
        <div className="mt-4 grid gap-4 max-w-xl">
          <label className="text-sm">
            Selected work section title
            <input
              className="input mt-1 w-full"
              value={draft.selectedWorkTitle}
              onChange={(e) =>
                setDraft({ ...draft, selectedWorkTitle: e.target.value })
              }
            />
          </label>
          <label className="text-sm">
            Selected work section description
            <input
              className="input mt-1 w-full"
              value={draft.selectedWorkDescription}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  selectedWorkDescription: e.target.value,
                })
              }
            />
          </label>
          <label className="text-sm">
            Featured gallery section title
            <input
              className="input mt-1 w-full"
              value={draft.featuredGalleryTitle}
              onChange={(e) =>
                setDraft({ ...draft, featuredGalleryTitle: e.target.value })
              }
            />
          </label>
          <label className="text-sm">
            Featured gallery section description
            <input
              className="input mt-1 w-full"
              value={draft.featuredGalleryDescription}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  featuredGalleryDescription: e.target.value,
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="border border-parchment bg-white p-5">
        <h2 className="font-serif text-lg text-bark">Bottom CTA strip</h2>
        <div className="mt-4 grid gap-4 max-w-xl">
          <label className="text-sm">
            Note
            <input
              className="input mt-1 w-full"
              value={draft.ctaNote}
              onChange={(e) => setDraft({ ...draft, ctaNote: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Contact link label
            <input
              className="input mt-1 w-full"
              value={draft.ctaContact}
              onChange={(e) => setDraft({ ...draft, ctaContact: e.target.value })}
            />
          </label>
        </div>
      </section>

      <button
        type="button"
        className="btn btn-primary text-sm"
        disabled={saving}
        onClick={() => void save()}
      >
        {saving ? "Saving…" : "Save all copy"}
      </button>
      <p className="text-xs text-stone">
        Values are stored as overrides. Code defaults in lib/content.ts still apply when a field is cleared.
      </p>
    </div>
  );
}
