/**
 * Date-only utilities — calendar dates in local time (no UTC shift).
 * Display: DD/MM/YYYY · API/storage: YYYY-MM-DD
 */

export const DATE_DISPLAY_PLACEHOLDER = "DD/MM/YYYY";
export const DATE_DISPLAY_FORMAT_LABEL = "DD/MM/YYYY";
export const DATE_RANGE_DISPLAY_SEPARATOR = " - ";

export type DateParts = { year: number; month: number; day: number };

const DISPLAY_RE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const API_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function isValidParts({ year, month, day }: DateParts): boolean {
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/** Local calendar date → YYYY-MM-DD (API). */
export function partsToApiDate(parts: DateParts): string {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

/** Parse YYYY-MM-DD without timezone conversion. */
export function parseApiDate(value: string | null | undefined): DateParts | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  const m = s.match(API_RE);
  if (!m) return null;
  const parts = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  return isValidParts(parts) ? parts : null;
}

/** Parse DD/MM/YYYY display input. */
export function parseDisplayDate(value: string | null | undefined): DateParts | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  const m = s.match(DISPLAY_RE);
  if (!m) return null;
  const parts = { year: Number(m[3]), month: Number(m[2]), day: Number(m[1]) };
  return isValidParts(parts) ? parts : null;
}

/** YYYY-MM-DD → DD/MM/YYYY for display. */
export function formatApiDateForDisplay(value: string | null | undefined): string {
  const parts = parseApiDate(value);
  if (!parts) return "";
  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}`;
}

/** DD/MM/YYYY → YYYY-MM-DD; returns null when empty or invalid. */
export function displayToApiDate(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const parts = parseDisplayDate(trimmed);
  return parts ? partsToApiDate(parts) : null;
}

export function isValidDisplayDate(value: string): boolean {
  return parseDisplayDate(value) !== null;
}

export function isValidApiDate(value: string): boolean {
  return parseApiDate(value) !== null;
}

/** Today's date in local timezone as YYYY-MM-DD. */
export function todayApiDate(): string {
  const now = new Date();
  return partsToApiDate({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

/** Local date N days ago as YYYY-MM-DD. */
export function apiDateDaysAgo(days: number): string {
  const t = new Date();
  t.setDate(t.getDate() - days);
  return partsToApiDate({
    year: t.getFullYear(),
    month: t.getMonth() + 1,
    day: t.getDate(),
  });
}

/** Format API date range for read-only labels. */
export function formatApiDateRangeForDisplay(
  from: string | null | undefined,
  to: string | null | undefined,
): string {
  const a = formatApiDateForDisplay(from);
  const b = formatApiDateForDisplay(to);
  if (!a && !b) return "";
  if (a && b) return `${a}${DATE_RANGE_DISPLAY_SEPARATOR}${b}`;
  return a || b;
}

/**
 * Normalize persisted values (API, ISO datetime prefix, or DD/MM/YYYY) to YYYY-MM-DD.
 */
export function normalizeToApiDate(value: string | null | undefined): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (!s) return null;
  const api = parseApiDate(s.slice(0, 10));
  if (api) return partsToApiDate(api);
  const display = parseDisplayDate(s);
  if (display) return partsToApiDate(display);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    return partsToApiDate({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    });
  }
  return null;
}

export function formatDatePartsForDisplay(parts: DateParts): string {
  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}`;
}

/** Compare API date strings (YYYY-MM-DD). */
export function compareApiDates(a: string, b: string): number {
  return a.localeCompare(b);
}

export const INVALID_DATE_MESSAGE = `Enter a valid date (${DATE_DISPLAY_FORMAT_LABEL})`;
