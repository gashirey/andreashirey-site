"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminNotice } from "@/components/admin/AdminNotice";
import {
  buildAdminFontCatalogUrl,
  filterSiteFonts,
  fontFamilyCss,
  FONT_CATEGORIES,
  getSiteFont,
  SITE_FONT_CATALOG,
  type FontCategory,
} from "@/lib/site-cms/fonts";
import {
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  TYPOGRAPHY_SECTIONS,
} from "@/lib/site-cms/typography";
import type {
  SiteSettingsRow,
  TypographyOverrides,
  TypographySectionId,
  TypographySectionOverride,
} from "@/lib/site-cms/types";

function SectionEditor({
  sectionId,
  overrides,
  onChange,
  fontFilter,
  fontSearch,
}: {
  sectionId: TypographySectionId;
  overrides: TypographyOverrides;
  onChange: (id: TypographySectionId, patch: TypographySectionOverride) => void;
  fontFilter: FontCategory | "all";
  fontSearch: string;
}) {
  const meta = TYPOGRAPHY_SECTIONS.find((s) => s.id === sectionId)!;
  const o = overrides[sectionId] ?? {};
  const fontId = o.fontId ?? meta.defaultFontId;
  const font = getSiteFont(fontId);
  const fonts = filterSiteFonts(fontFilter, fontSearch);

  const previewStyle = {
    fontFamily: font ? fontFamilyCss(font) : undefined,
    fontSize: o.fontSize || meta.defaultSize,
    color: o.color || meta.defaultColor,
    fontWeight: o.fontWeight || meta.defaultWeight,
  };

  return (
    <section className="border border-parchment bg-white p-4">
      <h3 className="font-medium text-bark">{meta.label}</h3>
      <p className="mt-0.5 text-xs text-stone">{meta.description}</p>

      <div
        className="mt-3 rounded-sm border border-parchment bg-cream px-3 py-3"
        style={previewStyle}
      >
        {meta.sampleText}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          Font
          <select
            className="input mt-1 w-full text-base"
            value={fontId}
            style={font ? { fontFamily: fontFamilyCss(font) } : undefined}
            onChange={(e) => onChange(sectionId, { ...o, fontId: e.target.value })}
          >
            {fonts.map((f) => (
              <option
                key={f.id}
                value={f.id}
                style={{ fontFamily: fontFamilyCss(f) }}
              >
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Size
          <select
            className="input mt-1 w-full"
            value={o.fontSize ?? ""}
            onChange={(e) =>
              onChange(sectionId, {
                ...o,
                fontSize: e.target.value || undefined,
              })
            }
          >
            <option value="">Default ({meta.defaultSize})</option>
            {FONT_SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Weight
          <select
            className="input mt-1 w-full"
            value={o.fontWeight ?? ""}
            onChange={(e) =>
              onChange(sectionId, {
                ...o,
                fontWeight: e.target.value || undefined,
              })
            }
          >
            <option value="">Default ({meta.defaultWeight})</option>
            {FONT_WEIGHT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm sm:col-span-2">
          Color
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={
                (o.color ?? meta.defaultColor).startsWith("#")
                  ? (o.color ?? meta.defaultColor)
                  : "#3a3834"
              }
              className="h-9 w-12 border border-parchment bg-white p-0.5"
              onChange={(e) =>
                onChange(sectionId, { ...o, color: e.target.value })
              }
            />
            <input
              type="text"
              placeholder={meta.defaultColor}
              value={o.color ?? ""}
              className="input flex-1 font-mono text-xs"
              onChange={(e) =>
                onChange(sectionId, {
                  ...o,
                  color: e.target.value.trim() || undefined,
                })
              }
            />
            <button
              type="button"
              className="text-xs text-stone underline"
              onClick={() =>
                onChange(sectionId, {
                  ...o,
                  color: undefined,
                })
              }
            >
              Reset
            </button>
          </div>
        </label>
      </div>
    </section>
  );
}

export function SiteTypographyPanel() {
  const [settings, setSettings] = useState<SiteSettingsRow | null>(null);
  const [overrides, setOverrides] = useState<TypographyOverrides>({});
  const [fontFilter, setFontFilter] = useState<FontCategory | "all">("all");
  const [fontSearch, setFontSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [setupError, setSetupError] = useState("");

  const catalogUrl = useMemo(() => buildAdminFontCatalogUrl(), []);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/site-cms");
    const data = await res.json();
    if (!res.ok) {
      setSetupError(data.error ?? "Could not load settings.");
      return;
    }
    const row = data.settings as SiteSettingsRow;
    setSettings(row);
    setOverrides(row.typography_overrides ?? {});
    setSetupError("");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleSections = useMemo(() => {
    const q = sectionFilter.trim().toLowerCase();
    if (!q) return TYPOGRAPHY_SECTIONS;
    return TYPOGRAPHY_SECTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.includes(q),
    );
  }, [sectionFilter]);

  function patchSection(id: TypographySectionId, patch: TypographySectionOverride) {
    setOverrides((prev) => ({ ...prev, [id]: patch }));
  }

  async function save() {
    setSaving(true);
    setNotice(null);
    const res = await fetch("/api/admin/site-cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typography_overrides: overrides }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setNotice({ type: "error", message: data.error ?? "Save failed." });
      return;
    }
    setSettings(data.settings as SiteSettingsRow);
    setOverrides((data.settings as SiteSettingsRow).typography_overrides ?? {});
    setNotice({
      type: "success",
      message: "Typography saved. Refresh the public site to preview.",
    });
  }

  async function resetAll() {
    if (!window.confirm("Reset all typography overrides to defaults?")) return;
    setOverrides({});
    setSaving(true);
    const res = await fetch("/api/admin/site-cms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typography_overrides: {} }),
    });
    setSaving(false);
    if (res.ok) {
      await load();
      setNotice({ type: "success", message: "Typography reset." });
    }
  }

  if (setupError) {
    return <p className="text-sm text-bark">{setupError}</p>;
  }

  if (!settings) {
    return <p className="text-sm text-stone">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={catalogUrl} />

      {notice ? (
        <AdminNotice
          type={notice.type}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      <section className="border border-parchment bg-white p-4">
        <h2 className="font-serif text-lg text-bark">Typography</h2>
        <p className="mt-1 text-sm text-stone">
          Set font, size, and color per section. {SITE_FONT_CATALOG.length} Google
          fonts available — filter by style or search by name.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {FONT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFontFilter(c.id)}
              className={`rounded-sm border px-3 py-1.5 text-xs ${
                fontFilter === c.id
                  ? "border-bark bg-bark text-cream"
                  : "border-parchment text-bark"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm">
          Search fonts
          <input
            type="search"
            className="input mt-1 max-w-md"
            placeholder="e.g. Playfair, script, sans…"
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
          />
        </label>

        <label className="mt-3 block text-sm">
          Filter sections
          <input
            type="search"
            className="input mt-1 max-w-md"
            placeholder="e.g. hero, footer…"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          />
        </label>
      </section>

      <div className="space-y-4">
        {visibleSections.map((s) => (
          <SectionEditor
            key={s.id}
            sectionId={s.id}
            overrides={overrides}
            onChange={patchSection}
            fontFilter={fontFilter}
            fontSearch={fontSearch}
          />
        ))}
      </div>

      <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-parchment bg-cream py-4">
        <button
          type="button"
          className="btn btn-primary text-sm"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? "Saving…" : "Save all typography"}
        </button>
        <button
          type="button"
          className="btn btn-secondary text-sm"
          disabled={saving}
          onClick={() => void resetAll()}
        >
          Reset all
        </button>
      </div>
    </div>
  );
}
