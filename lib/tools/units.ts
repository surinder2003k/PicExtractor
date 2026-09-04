export interface UnitDef {
  id: string;
  label: string;
  factor: number;
}

export interface UnitGroup {
  id: string;
  label: string;
  units: UnitDef[];
}

// All linear conversions expressed relative to a base unit.
const LENGTH_BASE = 1; // meters
const WEIGHT_BASE = 1; // grams

const FACTORS: Record<string, Record<string, number>> = {
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    inch: 0.0254,
    ft: 0.3048,
    yard: 0.9144,
    mile: 1609.344,
  },
  weight: {
    mg: 0.001,
    g: 1,
    kg: 1000,
    lb: 453.59237,
    oz: 28.349523125,
    "metric ton": 1_000_000,
  },
  data: {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  },
};

export const UNIT_GROUPS: UnitGroup[] = [
  { id: "length", label: "Length", units: buildUnits("length") },
  { id: "weight", label: "Weight / Mass", units: buildUnits("weight") },
  { id: "data", label: "Data Size", units: buildUnits("data") },
];

function buildUnits(group: string): UnitDef[] {
  return Object.entries(FACTORS[group]).map(([id, factor]) => ({ id, label: id.toUpperCase(), factor }));
}

export function convertUnit(group: string, value: number, from: string, to: string): number | null {
  const table = FACTORS[group];
  if (!table || !(from in table) || !(to in table)) return null;
  if (!Number.isFinite(value)) return null;
  const base = value * table[from];
  return base / table[to];
}

// Temperature needs formulas, not a linear factor.
export function convertTemperature(value: number, from: "C" | "F" | "K", to: "C" | "F" | "K"): number {
  let c: number;
  if (from === "C") c = value;
  else if (from === "F") c = (value - 32) * (5 / 9);
  else c = value - 273.15;

  if (to === "C") return c;
  if (to === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}