export type FontCategory = "serif" | "sans" | "display" | "handwriting";

export type SiteFontDefinition = {
  id: string;
  name: string;
  category: FontCategory;
  /** Google Fonts CSS family name */
  family: string;
  weights: number[];
  fallback: string;
};

export const FONT_CATEGORIES: { id: FontCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "serif", label: "Serif" },
  { id: "sans", label: "Sans" },
  { id: "display", label: "Display" },
  { id: "handwriting", label: "Handwriting" },
];

/** Google Fonts available in the site editor (expandable). */
export const SITE_FONT_CATALOG: SiteFontDefinition[] = [
  { id: "fraunces", name: "Fraunces", category: "serif", family: "Fraunces", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "cormorant", name: "Cormorant Garamond", category: "serif", family: "Cormorant Garamond", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "lora", name: "Lora", category: "serif", family: "Lora", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "libre-baskerville", name: "Libre Baskerville", category: "serif", family: "Libre Baskerville", weights: [400, 700], fallback: "Georgia, serif" },
  { id: "playfair", name: "Playfair Display", category: "serif", family: "Playfair Display", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "merriweather", name: "Merriweather", category: "serif", family: "Merriweather", weights: [400, 700], fallback: "Georgia, serif" },
  { id: "eb-garamond", name: "EB Garamond", category: "serif", family: "EB Garamond", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "source-serif", name: "Source Serif 4", category: "serif", family: "Source Serif 4", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "dm-serif", name: "DM Serif Display", category: "serif", family: "DM Serif Display", weights: [400], fallback: "Georgia, serif" },
  { id: "bitter", name: "Bitter", category: "serif", family: "Bitter", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "crimson", name: "Crimson Pro", category: "serif", family: "Crimson Pro", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "spectral", name: "Spectral", category: "serif", family: "Spectral", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "karla", name: "Karla", category: "sans", family: "Karla", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "dm-sans", name: "DM Sans", category: "sans", family: "DM Sans", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "work-sans", name: "Work Sans", category: "sans", family: "Work Sans", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "source-sans", name: "Source Sans 3", category: "sans", family: "Source Sans 3", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "nunito-sans", name: "Nunito Sans", category: "sans", family: "Nunito Sans", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "outfit", name: "Outfit", category: "sans", family: "Outfit", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "figtree", name: "Figtree", category: "sans", family: "Figtree", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "inter", name: "Inter", category: "sans", family: "Inter", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "open-sans", name: "Open Sans", category: "sans", family: "Open Sans", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "lato", name: "Lato", category: "sans", family: "Lato", weights: [400, 700], fallback: "system-ui, sans-serif" },
  { id: "raleway", name: "Raleway", category: "sans", family: "Raleway", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "mulish", name: "Mulish", category: "sans", family: "Mulish", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "manrope", name: "Manrope", category: "sans", family: "Manrope", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "josefin-sans", name: "Josefin Sans", category: "sans", family: "Josefin Sans", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "jost", name: "Jost", category: "sans", family: "Jost", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "syne", name: "Syne", category: "display", family: "Syne", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "cinzel", name: "Cinzel", category: "display", family: "Cinzel", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "cardo", name: "Cardo", category: "display", family: "Cardo", weights: [400, 700], fallback: "Georgia, serif" },
  { id: "abril", name: "Abril Fatface", category: "display", family: "Abril Fatface", weights: [400], fallback: "Georgia, serif" },
  { id: "yeseva", name: "Yeseva One", category: "display", family: "Yeseva One", weights: [400], fallback: "Georgia, serif" },
  { id: "bodoni", name: "Bodoni Moda", category: "display", family: "Bodoni Moda", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "italiana", name: "Italiana", category: "display", family: "Italiana", weights: [400], fallback: "Georgia, serif" },
  { id: "caveat", name: "Caveat", category: "handwriting", family: "Caveat", weights: [400, 500, 600, 700], fallback: "cursive" },
  { id: "dancing", name: "Dancing Script", category: "handwriting", family: "Dancing Script", weights: [400, 500, 600, 700], fallback: "cursive" },
  { id: "satisfy", name: "Satisfy", category: "handwriting", family: "Satisfy", weights: [400], fallback: "cursive" },
  { id: "pacifico", name: "Pacifico", category: "handwriting", family: "Pacifico", weights: [400], fallback: "cursive" },
  { id: "great-vibes", name: "Great Vibes", category: "handwriting", family: "Great Vibes", weights: [400], fallback: "cursive" },
  { id: "homemade", name: "Homemade Apple", category: "handwriting", family: "Homemade Apple", weights: [400], fallback: "cursive" },
  { id: "shadows", name: "Shadows Into Light", category: "handwriting", family: "Shadows Into Light", weights: [400], fallback: "cursive" },
  { id: "patrick", name: "Patrick Hand", category: "handwriting", family: "Patrick Hand", weights: [400], fallback: "cursive" },
  { id: "amatic", name: "Amatic SC", category: "handwriting", family: "Amatic SC", weights: [400, 700], fallback: "cursive" },
  { id: "kalam", name: "Kalam", category: "handwriting", family: "Kalam", weights: [400, 700], fallback: "cursive" },
  { id: "architects", name: "Architects Daughter", category: "handwriting", family: "Architects Daughter", weights: [400], fallback: "cursive" },
  { id: "libre-franklin", name: "Libre Franklin", category: "sans", family: "Libre Franklin", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "pt-sans", name: "PT Sans", category: "sans", family: "PT Sans", weights: [400, 700], fallback: "system-ui, sans-serif" },
  { id: "rubik", name: "Rubik", category: "sans", family: "Rubik", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "quicksand", name: "Quicksand", category: "sans", family: "Quicksand", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "barlow", name: "Barlow", category: "sans", family: "Barlow", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "ibm-plex-sans", name: "IBM Plex Sans", category: "sans", family: "IBM Plex Sans", weights: [400, 500, 600, 700], fallback: "system-ui, sans-serif" },
  { id: "ibm-plex-serif", name: "IBM Plex Serif", category: "serif", family: "IBM Plex Serif", weights: [400, 500, 600, 700], fallback: "Georgia, serif" },
  { id: "zilla-slab", name: "Zilla Slab", category: "serif", family: "Zilla Slab", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "newsreader", name: "Newsreader", category: "serif", family: "Newsreader", weights: [400, 600, 700], fallback: "Georgia, serif" },
  { id: "literata", name: "Literata", category: "serif", family: "Literata", weights: [400, 600, 700], fallback: "Georgia, serif" },
];

const fontById = new Map(SITE_FONT_CATALOG.map((f) => [f.id, f]));

export function getSiteFont(id: string | undefined): SiteFontDefinition | undefined {
  if (!id) return undefined;
  return fontById.get(id);
}

export function filterSiteFonts(
  category: FontCategory | "all",
  search: string,
): SiteFontDefinition[] {
  const q = search.trim().toLowerCase();
  return SITE_FONT_CATALOG.filter((f) => {
    if (category !== "all" && f.category !== category) return false;
    if (q && !f.name.toLowerCase().includes(q) && !f.id.includes(q)) {
      return false;
    }
    return true;
  });
}

export function fontFamilyCss(font: SiteFontDefinition): string {
  return `"${font.family}", ${font.fallback}`;
}

/** Build Google Fonts CSS2 URL for the given font ids. */
export function buildGoogleFontsUrl(fontIds: Iterable<string>): string | null {
  const families: string[] = [];
  const seen = new Set<string>();

  for (const id of fontIds) {
    const font = getSiteFont(id);
    if (!font || seen.has(font.family)) continue;
    seen.add(font.family);
    const weights = font.weights.join(";");
    families.push(
      `family=${encodeURIComponent(font.family)}:wght@${weights}`,
    );
  }

  if (!families.length) return null;
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

/** Load entire catalog in admin previews (chunked if needed). */
export function buildAdminFontCatalogUrl(): string {
  return (
    buildGoogleFontsUrl(SITE_FONT_CATALOG.map((f) => f.id)) ??
    "https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap"
  );
}
