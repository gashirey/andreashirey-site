/**
 * Sessions / experience page — high-end inquiry funnel copy.
 */

export const sessionsPage = {
  metaTitle: "Sessions",
  metaDescription:
    "Select photography sessions with Andrea Shirey — a considered process from inquiry through private gallery delivery. Limited availability in Virginia.",
  eyebrow: "Select sessions",
  title: "A considered experience",
  intro:
    "Andrea accepts a limited number of sessions each season so every project can be personal, intentional, and fully considered — from the first conversation through a private gallery.",
  offerings: [
    {
      title: "Weddings",
      description:
        "Observational coverage for couples who want their day documented with quiet attention — light, place, and the in-between moments.",
    },
    {
      title: "Portraits",
      description:
        "Individual sessions shaped around presence and atmosphere. Ideal for personal milestones, creative portraits, and editorial-minded work.",
    },
    {
      title: "Family",
      description:
        "Unhurried sessions that favor connection over posing — made for families who want photographs that feel like them.",
    },
    {
      title: "Branding & editorial",
      description:
        "Image work for brands, makers, and creatives who need photography with the same restraint and clarity as the work itself.",
    },
  ],
  process: [
    {
      step: "01",
      title: "Inquiry",
      description:
        "Share a little about what you're hoping to create — timing, place, and what drew you to the work. Every request is reviewed personally.",
    },
    {
      step: "02",
      title: "Creative consultation",
      description:
        "If the project feels aligned, we schedule a dedicated planning conversation covering vision, location, styling, timeline, and investment.",
    },
    {
      step: "03",
      title: "The session",
      description:
        "A thoughtfully paced day or sitting. Direction stays light so the photographs can stay honest — guided by light, place, and presence.",
    },
    {
      step: "04",
      title: "Private gallery",
      description:
        "Your finished images are delivered in a private client gallery — curated, easy to view, and made for sharing with the people who matter.",
    },
  ],
  investment: {
    title: "Custom by design",
    intro:
      "Sessions are quoted individually based on scope, timing, travel, and deliverables. Starting ranges below are a guide for conversation — not a fixed menu.",
    tiers: [
      {
        label: "Portrait & family sessions",
        range: "From $1,200",
        note: "Typically includes planning, the session, and a curated private gallery.",
      },
      {
        label: "Branding & editorial",
        range: "From $1,800",
        note: "Scoped to the project — usage, locations, and deliverables shape the investment.",
      },
      {
        label: "Weddings",
        range: "From $4,500",
        note: "Coverage length and travel are tailored after the Creative Consultation.",
      },
    ],
    footnote:
      "A Creative Consultation is the next step after inquiry. For select sessions, the consultation fee may be credited toward the final investment.",
  },
  inclusions: [
    "Personal review of every inquiry for fit and timing",
    "Creative Consultation to align vision, location, and styling",
    "Unhurried session paced around light and presence",
    "Curated private gallery for viewing and sharing",
    "Thoughtful guidance before and after the session",
  ],
  testimonial: {
    quote:
      "The whole experience felt calm and intentional — from the first conversation to the gallery. The photographs feel like us.",
    attribution: "A recent client",
  },
  closing: {
    eyebrow: "Limited availability · Virginia",
    body: "If the work resonates, begin with an inquiry. Andrea will respond personally when the timing and creative direction feel right.",
  },
} as const;
