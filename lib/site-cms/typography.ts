import type { CSSProperties } from "react";
import { getDirection } from "@/lib/design-lab/directions";
import {
  buildGoogleFontsUrl,
  fontFamilyCss,
  getSiteFont,
  type SiteFontDefinition,
} from "./fonts";
import type {
  SiteSettingsRow,
  TypographyOverrides,
  TypographySectionId,
  TypographySectionOverride,
  TypographySectionResolved,
} from "./types";

export const FONT_SIZE_OPTIONS = [
  { value: "0.75rem", label: "XS — 12px" },
  { value: "0.8125rem", label: "13px" },
  { value: "0.875rem", label: "SM — 14px" },
  { value: "1rem", label: "Base — 16px" },
  { value: "1.125rem", label: "LG — 18px" },
  { value: "1.25rem", label: "XL — 20px" },
  { value: "1.5rem", label: "2XL — 24px" },
  { value: "1.875rem", label: "3XL — 30px" },
  { value: "2.25rem", label: "4XL — 36px" },
  { value: "2.75rem", label: "5XL — 44px" },
  { value: "3.25rem", label: "6XL — 52px" },
  { value: "4rem", label: "7XL — 64px" },
] as const;

export const FONT_WEIGHT_OPTIONS = [
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semibold (600)" },
  { value: "700", label: "Bold (700)" },
] as const;

export type TypographySectionMeta = {
  id: TypographySectionId;
  label: string;
  description: string;
  defaultFontId: string;
  defaultSize: string;
  defaultColor: string;
  defaultWeight: string;
  sampleText: string;
};

export const TYPOGRAPHY_SECTIONS: TypographySectionMeta[] = [
  {
    id: "hero_title",
    label: "Homepage hero headline",
    description: "Large title on the homepage hero image",
    defaultFontId: "fraunces",
    defaultSize: "3.25rem",
    defaultColor: "#ffffff",
    defaultWeight: "500",
    sampleText: "Seasonal Flowers from Central Virginia",
  },
  {
    id: "hero_subtitle",
    label: "Homepage hero subtitle",
    description: "Supporting line under the hero headline",
    defaultFontId: "karla",
    defaultSize: "1.125rem",
    defaultColor: "rgba(255,255,255,0.85)",
    defaultWeight: "400",
    sampleText: "Weekly harvests and limited seasonal availability.",
  },
  {
    id: "nav",
    label: "Navigation links",
    description: "Header and mobile menu",
    defaultFontId: "karla",
    defaultSize: "0.75rem",
    defaultColor: "#6f6c66",
    defaultWeight: "400",
    sampleText: "Availability",
  },
  {
    id: "body",
    label: "Body text (site-wide)",
    description: "Default paragraphs and UI copy",
    defaultFontId: "karla",
    defaultSize: "1rem",
    defaultColor: "#3f3836",
    defaultWeight: "400",
    sampleText: "Field-grown stems. Weekly harvest availability.",
  },
  {
    id: "section_title",
    label: "Section headings",
    description: "Titles on homepage bands and listing sections",
    defaultFontId: "fraunces",
    defaultSize: "2.25rem",
    defaultColor: "#3a3834",
    defaultWeight: "500",
    sampleText: "Current availability",
  },
  {
    id: "section_description",
    label: "Section descriptions",
    description: "Subtitle under section headings",
    defaultFontId: "karla",
    defaultSize: "1rem",
    defaultColor: "#6f6c66",
    defaultWeight: "400",
    sampleText: "Seasonal harvests — updated weekly.",
  },
  {
    id: "page_title",
    label: "Page titles (About, etc.)",
    description: "Top-level heading on inner pages",
    defaultFontId: "fraunces",
    defaultSize: "2.25rem",
    defaultColor: "#3a3834",
    defaultWeight: "500",
    sampleText: "About",
  },
  {
    id: "page_body",
    label: "Page body paragraphs",
    description: "About page and long-form text blocks",
    defaultFontId: "karla",
    defaultSize: "1rem",
    defaultColor: "#6f6c66",
    defaultWeight: "400",
    sampleText:
      "Grey Gables Farm is a Central Virginia flower farm growing seasonal cut flowers.",
  },
  {
    id: "footer_brand",
    label: "Footer farm name",
    description: "Farm name in the footer",
    defaultFontId: "fraunces",
    defaultSize: "1.25rem",
    defaultColor: "#3a3834",
    defaultWeight: "500",
    sampleText: "Grey Gables Farm",
  },
  {
    id: "footer_text",
    label: "Footer description",
    description: "Short blurb and contact lines",
    defaultFontId: "karla",
    defaultSize: "0.875rem",
    defaultColor: "#6f6c66",
    defaultWeight: "400",
    sampleText: "Field-grown stems. Weekly harvest availability.",
  },
  {
    id: "footer_link",
    label: "Footer links",
    description: "Footer navigation and email links",
    defaultFontId: "karla",
    defaultSize: "0.875rem",
    defaultColor: "#3a3834",
    defaultWeight: "400",
    sampleText: "Contact",
  },
  {
    id: "announcement",
    label: "Announcement bar",
    description: "Top banner message",
    defaultFontId: "karla",
    defaultSize: "0.75rem",
    defaultColor: "#6f6c66",
    defaultWeight: "400",
    sampleText: "Weekly listings updated from the field.",
  },
  {
    id: "button",
    label: "Buttons & CTAs",
    description: "Primary buttons and text links styled as actions",
    defaultFontId: "karla",
    defaultSize: "0.875rem",
    defaultColor: "#ffffff",
    defaultWeight: "500",
    sampleText: "Current Availability",
  },
  {
    id: "eyebrow",
    label: "Eyebrow labels",
    description: "Small green labels above section titles",
    defaultFontId: "karla",
    defaultSize: "0.75rem",
    defaultColor: "#7f9a85",
    defaultWeight: "500",
    sampleText: "From the field",
  },
];

function directionDefaultFonts(directionId: string): {
  serifId: string;
  sansId: string;
} {
  const d = getDirection(directionId);
  const serifVar = d?.serifVar ?? "";
  const sansVar = d?.sansVar ?? "";
  const map: Record<string, string> = {
    "var(--font-lab-fraunces)": "fraunces",
    "var(--font-lab-cormorant)": "cormorant",
    "var(--font-lab-libre)": "libre-baskerville",
    "var(--font-lab-lora)": "lora",
    "var(--font-lab-playfair)": "playfair",
    "var(--font-lab-karla)": "karla",
    "var(--font-lab-dm)": "dm-sans",
    "var(--font-lab-work)": "work-sans",
    "var(--font-lab-source)": "source-sans",
    "var(--font-lab-nunito)": "nunito-sans",
  };
  return {
    serifId: map[serifVar] ?? "fraunces",
    sansId: map[sansVar] ?? "karla",
  };
}

function resolveFontId(
  section: TypographySectionMeta,
  override: TypographySectionOverride | undefined,
  directionId: string,
): string {
  if (override?.fontId && getSiteFont(override.fontId)) {
    return override.fontId;
  }
  const { serifId, sansId } = directionDefaultFonts(directionId);
  const serifSections = new Set<TypographySectionId>([
    "hero_title",
    "section_title",
    "page_title",
    "footer_brand",
  ]);
  if (section.defaultFontId === "fraunces" && serifSections.has(section.id)) {
    return serifId;
  }
  if (section.defaultFontId === "karla") {
    return sansId;
  }
  return section.defaultFontId;
}

export function resolveTypographySection(
  section: TypographySectionMeta,
  overrides: TypographyOverrides,
  directionId: string,
  themeText?: string,
  themeMuted?: string,
): TypographySectionResolved {
  const o = overrides[section.id];
  const fontId = resolveFontId(section, o, directionId);
  const font = getSiteFont(fontId)!;

  let color = section.defaultColor;
  if (o?.color?.trim()) {
    color = o.color.trim();
  } else if (section.id === "body" && themeText) {
    color = themeText;
  } else if (
    (section.id === "section_description" ||
      section.id === "page_body" ||
      section.id === "footer_text" ||
      section.id === "nav") &&
    themeMuted
  ) {
    color = themeMuted;
  }

  return {
    id: section.id,
    fontId,
    fontFamily: fontFamilyCss(font),
    fontSize: o?.fontSize?.trim() || section.defaultSize,
    color,
    fontWeight: o?.fontWeight?.trim() || section.defaultWeight,
  };
}

export function resolveAllTypography(
  settings: SiteSettingsRow,
): Record<TypographySectionId, TypographySectionResolved> {
  const direction = getDirection(settings.direction_id);
  const text = settings.color_overrides.text ?? direction?.colors.text;
  const muted = settings.color_overrides.muted ?? direction?.colors.muted;

  const out = {} as Record<TypographySectionId, TypographySectionResolved>;
  for (const section of TYPOGRAPHY_SECTIONS) {
    out[section.id] = resolveTypographySection(
      section,
      settings.typography_overrides,
      settings.direction_id,
      text,
      muted,
    );
  }
  return out;
}

export function typographyToCssVars(
  resolved: Record<TypographySectionId, TypographySectionResolved>,
): CSSProperties {
  const style: Record<string, string> = {};
  for (const [id, t] of Object.entries(resolved)) {
    const key = id.replace(/_/g, "-");
    style[`--type-${key}-font`] = t.fontFamily;
    style[`--type-${key}-size`] = t.fontSize;
    style[`--type-${key}-color`] = t.color;
    style[`--type-${key}-weight`] = t.fontWeight;
  }
  return style as CSSProperties;
}

export function collectFontIdsFromTypography(
  settings: SiteSettingsRow,
): string[] {
  const resolved = resolveAllTypography(settings);
  return [...new Set(Object.values(resolved).map((r) => r.fontId))];
}

export function buildResolvedTypography(settings: SiteSettingsRow): {
  sections: Record<TypographySectionId, TypographySectionResolved>;
  cssVars: CSSProperties;
  googleFontsUrl: string | null;
} {
  const sections = resolveAllTypography(settings);
  const fontIds = collectFontIdsFromTypography(settings);
  return {
    sections,
    cssVars: typographyToCssVars(sections),
    googleFontsUrl: buildGoogleFontsUrl(fontIds),
  };
}
