const TZ = "America/New_York";

/** YYYY-MM-DD in farm timezone (Louisa, VA) */
export function todayFarmDate(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  });
}
