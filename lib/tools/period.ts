export interface PeriodParams {
  start?: string; // ISO date
  end?: string; // ISO date
  years?: number;
  months?: number;
}

export interface PeriodResult {
  totalDays: number;
  totalMonths: number;
  totalYears: number;
  breakdown: string;
  valid: boolean;
  error?: string;
}

/** Returns age/tenure/duration between two dates or from a date to now. */
export function computePeriod(a: string, b?: string): PeriodResult {
  const start = new Date(a);
  const end = b ? new Date(b) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { totalDays: 0, totalMonths: 0, totalYears: 0, breakdown: "", valid: false, error: "Invalid date." };
  }
  if (end.getTime() < start.getTime()) {
    return {
      totalDays: 0,
      totalMonths: 0,
      totalYears: 0,
      breakdown: "",
      valid: false,
      error: "End date must be after start date.",
    };
  }

  const totalDays = Math.floor((end.getTime() - start.getTime()) / 86_400_000);
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  return {
    totalDays,
    totalMonths: Math.max(0, months),
    totalYears: Math.max(0, years),
    breakdown: totalDays < 0 ? "" : formatBreakdown(totalDays, years, remMonths),
    valid: true,
  };
}

function formatBreakdown(days: number, years: number, months: number): string {
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  const remDays = days % 30;
  if (remDays > 0) parts.push(`${remDays} day${remDays > 1 ? "s" : ""}`);
  if (parts.length === 0) parts.push("0 days");
  return parts.join(" ");
}