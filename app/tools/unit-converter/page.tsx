"use client";

import { useState } from "react";
import { UNIT_GROUPS, convertUnit, convertTemperature, type UnitGroup } from "@/lib/tools/units";

export default function UnitConverterPage() {
  const [group, setGroup] = useState<UnitGroup>(UNIT_GROUPS[0]);
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(group.units[0].id);
  const [to, setTo] = useState(group.units[1]?.id ?? group.units[0].id);

  const isTemp = group.id === "temperature";
  const tempUnits: ("C" | "F" | "K")[] = ["C", "F", "K"];

  const pickGroup = (id: string) => {
    const g = UNIT_GROUPS.find((u) => u.id === id) ?? UNIT_GROUPS[0];
    setGroup(g);
    setValue("1");
    setFrom(g.units[0].id);
    setTo(g.units[1]?.id ?? g.units[0].id);
  };

  const input = Number(value);
  const result = isTemp
    ? convertTemperature(input, from as any, to as any)
    : convertUnit(group.id, input, from, to);

  const format = (n: number | null) =>
    n === null || Number.isNaN(n) ? "—" : Number.isFinite(n) && Math.abs(n) < 0.0001 ? n.toExponential(4) : n.toLocaleString(undefined, { maximumFractionDigits: 6 });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Unit Converter</h1>
      <p className="mt-2 text-muted-foreground">Convert length, weight, temperature,and data size.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {[...UNIT_GROUPS, { id: "temperature", label: "Temperature", units: [] }].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => pickGroup(g.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              (isTemp ? g.id === "temperature" : group.id === g.id)
                ? "bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-secondary"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-32">
            <label className="mb-1 block text-xs text-muted-foreground">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-md border border-input bg-background p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="min-w-32">
            <label className="mb-1 block text-xs text-muted-foreground">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none">
              {isTemp
                ? tempUnits.map((u) => <option key={u} value={u}>{u}</option>)
                : group.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>

          <div className="min-w-32">
            <label className="mb-1 block text-xs text-muted-foreground">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-md border border-border bg-background p-3 text-sm outline-none">
              {isTemp
                ? tempUnits.map((u) => <option key={u} value={u}>{u}</option>)
                : group.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted p-5 text-center">
          <span className="text-xs text-muted-foreground">Result</span>
          <p className="text-3xl font-bold">
            {from} → {to}: {format(result as number | null)}
          </p>
        </div>
      </div>
    </div>
  );
}