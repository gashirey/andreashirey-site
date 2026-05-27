export const inquiryCopy = {
  pageTitle: "Inquire",
  metaDescription:
    "Begin a session inquiry with Andrea Shirey Photography — select sessions, limited availability.",
  intro:
    "Andrea accepts a limited number of sessions each season so each client experience can be personal, intentional, and fully considered. Please share a little about what you're hoping to create.",
  submitLabel: "Submit inquiry",
  submittingLabel: "Sending…",
  confirmation: {
    title: "Thank you for reaching out.",
    paragraphs: [
      "Your inquiry has been received. Andrea personally reviews each request to determine fit, timing, and creative direction.",
      "If the project feels aligned, the next step is a Creative Consultation — a dedicated planning conversation to discuss vision, location, styling, timeline, and the overall experience.",
      "For select sessions, the consultation fee may be credited toward the final session investment.",
    ],
    ctaLabel: "Return to portfolio",
    ctaHref: "/gallery",
    /** TODO: link to consultation scheduler when ready */
    schedulerNote: "",
  },
} as const;

export const inquiryCtas = {
  primary: { label: "Inquire About a Session", href: "/inquire" },
  secondary: { label: "Begin the Conversation", href: "/inquire" },
  availability: { label: "Request Availability", href: "/inquire" },
} as const;
