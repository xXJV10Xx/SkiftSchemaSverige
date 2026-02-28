// ================= SSAB Oxelösund 5-lag SKIFTSCHEMA v3.0 =================
// KALIBRERAD & VERIFIERAD mot 14 punkter 2026-2027 (feb-nov, mars-seq perfekt)
// startDate: 1999-01-20 +21 offset → Fm2-Em3-Nt2-led5 exakt!
// Mönster från skaparen (35 tecken/lag, ' '=ledig/friskift)

export type ShiftCode = "F" | "E" | "N";

const PATTERNS: Record<string, string> = {
  Lag1: "     FFEENNN    FFFEENN     FFEEENN",
  Lag2: "NN     FFEEENN     FFEENNN    FFFEE",
  Lag3: "EENNN    FFFEENN     FFEEENN     FF",
  Lag4: "FFEEENN     FFEENNN    FFFEENN     ",
  Lag5: "  FFFEENN     FFEEENN     FFEENNN  ",
};

const START_DATE = new Date("1999-01-20T00:00:00Z");
const CYCLE_LENGTH = 35;
const OFFSET = 21;

export const SCHEMA_ID = "ssab-oxelosund-5lag";
export const SCHEMA_VERSION = "v3.0-mar11-seq-verified";
export const SCHEMA_LABEL = "SSAB Oxelösund 5-lag";

/** Huvudfunktion: vilket skift har lag X på datum (F/E/N eller null = ledig). */
export function getShift(lag: 1 | 2 | 3 | 4 | 5, dateStr: string): ShiftCode | null {
  const date = new Date(dateStr + "T00:00:00Z");
  if (isNaN(date.getTime())) throw new Error("Ogiltigt datum");

  const diffDays = Math.floor((date.getTime() - START_DATE.getTime()) / 86400000);
  const index = ((diffDays + OFFSET) % CYCLE_LENGTH + CYCLE_LENGTH) % CYCLE_LENGTH;

  const pattern = PATTERNS[`Lag${lag}`];
  const shiftChar = pattern.charAt(index);

  return shiftChar === " " ? null : (shiftChar as ShiftCode);
}

/** Alla lag samma dag. */
export function getAllShifts(dateStr: string): Record<number, ShiftCode | null> {
  const shifts: Record<number, ShiftCode | null> = {};
  for (let lag = 1; lag <= 5; lag++) {
    shifts[lag] = getShift(lag as 1 | 2 | 3 | 4 | 5, dateStr);
  }
  return shifts;
}

/** Månadsgenerator (API/cache). */
export function generateMonth(
  year: number,
  month: number
): Array<{ date: string; shifts: Record<number, ShiftCode | null> }> {
  const monthData: Array<{ date: string; shifts: Record<number, ShiftCode | null> }> = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    monthData.push({
      date: dateStr,
      shifts: getAllShifts(dateStr),
    });
  }

  return monthData;
}

export { PATTERNS, START_DATE, CYCLE_LENGTH, OFFSET };
