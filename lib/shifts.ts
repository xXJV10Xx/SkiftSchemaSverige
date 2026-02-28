// lib/shifts.ts - SKIFTSCHEMA SVERIGE
// Använder SSAB Oxelösund 5-lag v3.0 (kalibrerad) + RÖDA/GRÖNA dagar
// Källa: lib/schemas/ssab-oxelosund-5lag.ts

import { getSchema } from "./schemas";

const schema = getSchema();

export type ShiftCode = "F" | "E" | "N";

// Re-export från aktivt schema
export const getShift = schema.getShift;
export const getAllShifts = schema.getAllShifts;
export const generateMonth = schema.generateMonth;
export const SCHEMA_VERSION = schema.version;
export const SCHEMA_LABEL = schema.label;

// ================= RÖDA/GRÖNA DAGER =================
export interface SpecialDay {
  tooltip: string;
  dayNumState: 0 | 1 | 2; // 0=vardag, 1=röd(storhelg), 2=grön(ledig/halvdag)
  shiftStates: Partial<Record<ShiftCode, 0 | 1 | 2>>;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

function parseDateStr(dateStr: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) throw new Error(`Invalid dateStr: ${dateStr} (expected YYYY-MM-DD)`);
  return { y: Number(m[1]), mo: Number(m[2]), d: Number(m[3]) };
}

function utcDayNumber(dateStr: string) {
  const { y, mo, d } = parseDateStr(dateStr);
  return Math.floor(Date.UTC(y, mo - 1, d) / 86_400_000);
}

function easterSundayDateStr(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function addDays(dateStr: string, deltaDays: number) {
  const dayNum = utcDayNumber(dateStr);
  const dt = new Date((dayNum + deltaDays) * 86_400_000);
  return toDateStr(dt);
}

function midsummerEveDateStr(year: number) {
  for (let day = 19; day <= 25; day++) {
    const dt = new Date(Date.UTC(year, 5, day));
    if (dt.getUTCDay() === 5) return `${year}-06-${pad2(day)}`;
  }
  return `${year}-06-19`;
}

function midsummerDayDateStr(year: number) {
  for (let day = 20; day <= 26; day++) {
    const dt = new Date(Date.UTC(year, 5, day));
    if (dt.getUTCDay() === 6) return `${year}-06-${pad2(day)}`;
  }
  return `${year}-06-20`;
}

function allSaintsDayDateStr(year: number) {
  const candidates: Array<{ month: number; day: number }> = [
    { month: 10, day: 31 },
    { month: 11, day: 1 },
    { month: 11, day: 2 },
    { month: 11, day: 3 },
    { month: 11, day: 4 },
    { month: 11, day: 5 },
    { month: 11, day: 6 },
  ];
  for (const c of candidates) {
    const dt = new Date(Date.UTC(year, c.month - 1, c.day));
    if (dt.getUTCDay() === 6) return `${year}-${pad2(c.month)}-${pad2(c.day)}`;
  }
  return `${year}-10-31`;
}

function buildSpecialDays(fromYear: number, toYear: number): Record<string, SpecialDay> {
  const map: Record<string, SpecialDay> = {};
  const RED: SpecialDay = {
    tooltip: "",
    dayNumState: 1,
    shiftStates: { F: 2, E: 2, N: 1 },
  };
  const GREEN: SpecialDay = {
    tooltip: "",
    dayNumState: 2,
    shiftStates: { F: 2, E: 2, N: 1 },
  };

  for (let year = fromYear; year <= toYear; year++) {
    const easter = easterSundayDateStr(year);
    const goodFriday = addDays(easter, -2);
    const easterEve = addDays(easter, -1);
    const easterMonday = addDays(easter, 1);
    const ascension = addDays(easter, 39);

    map[`${year}-01-01`] = { ...RED, tooltip: "Nyårsdagen" };
    map[`${year}-01-06`] = { ...RED, tooltip: "Trettondagen" };
    map[goodFriday] = { ...RED, tooltip: "Långfredag" };
    map[easter] = { ...RED, tooltip: "Påskdagen" };
    map[easterMonday] = { ...RED, tooltip: "Annandag påsk" };
    map[easterEve] = { ...GREEN, tooltip: "Påskafton" };
    map[`${year}-05-01`] = { ...RED, tooltip: "Första maj" };
    map[ascension] = { ...RED, tooltip: "Kristi himmelsfärdsdag" };
    map[`${year}-06-06`] = { ...RED, tooltip: "Sveriges nationaldag" };
    map[midsummerEveDateStr(year)] = { ...GREEN, tooltip: "Midsommarafton" };
    map[midsummerDayDateStr(year)] = { ...RED, tooltip: "Midsommardagen" };
    map[allSaintsDayDateStr(year)] = { ...RED, tooltip: "Alla helgons dag" };
    map[`${year}-12-24`] = { ...GREEN, tooltip: "Julafton" };
    map[`${year}-12-25`] = { ...RED, tooltip: "Juldagen" };
    map[`${year}-12-26`] = { ...RED, tooltip: "Annandag jul" };
    map[`${year}-12-31`] = { ...GREEN, tooltip: "Nyårsafton" };
  }
  return map;
}

const SPECIAL_DAYS_2026_2029: Record<string, SpecialDay> = buildSpecialDays(2026, 2029);

const COLOR_MAP: Record<number, { bg: string; text: string; label: string }> = {
  0: { bg: "#0b1220", text: "#e2e8f0", label: "Vardag" },
  1: { bg: "#7f1d1d", text: "#fff", label: "RÖD (storhelg)" },
  2: { bg: "#14532d", text: "#fff", label: "GRÖN" },
};

// ================= ShiftData + getShiftFull (kalender-API) =================
export interface ShiftData {
  shift: ShiftCode | null;
  special?: {
    state: number;
    tooltip: string;
    color: { bg: string; text: string };
  };
  dateStr: string;
  lag: number;
}

export function getShiftFull(lagNum: 1 | 2 | 3 | 4 | 5, dateStr: string): ShiftData {
  const baseShift = schema.getShift(lagNum, dateStr);
  if (!baseShift) {
    return { shift: null, dateStr, lag: lagNum };
  }

  const special = SPECIAL_DAYS_2026_2029[dateStr];
  let specialData = { state: 0, tooltip: "", color: COLOR_MAP[0] };

  if (special) {
    const shiftState = special.shiftStates[baseShift] ?? 0;
    specialData = {
      state: shiftState,
      tooltip: special.tooltip,
      color: COLOR_MAP[shiftState],
    };
  }

  return {
    shift: baseShift,
    special: specialData.state > 0 ? specialData : undefined,
    dateStr,
    lag: lagNum,
  };
}

export function generateMonthShifts(
  year: number,
  month: number,
  lagNum: 1 | 2 | 3 | 4 | 5
): ShiftData[] {
  const shifts: ShiftData[] = [];
  const date = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    date.setDate(day);
    const dateStr = toDateStr(date);
    shifts.push(getShiftFull(lagNum, dateStr));
  }

  return shifts;
}

export function generateAllLagsMonth(year: number, month: number): Record<number, ShiftData[]> {
  const allLags: Record<number, ShiftData[]> = {};
  for (let lag = 1; lag <= 5; lag++) {
    allLags[lag] = generateMonthShifts(year, month, lag as 1 | 2 | 3 | 4 | 5);
  }
  return allLags;
}

export { SPECIAL_DAYS_2026_2029, COLOR_MAP };
