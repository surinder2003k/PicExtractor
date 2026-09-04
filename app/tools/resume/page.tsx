"use client";

import { useState } from "react";
import { Plus, Trash2, Printer } from "lucide-react";

interface Job { id: number; role: string; company: string; period: string; points: string; }
interface Skill { id: number; name: string; }

export default function ResumePage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [summary, setSummary] = useState("");
  const [jobs, setJobs] = useState<Job[]>([{ id: 1, role: "", company: "", period: "", points: "" }]);
  const [skills, setSkills] = useState<Skill[]>([]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="mt-2 text-muted-foreground">Fill in your details, then print or save as PDF.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Printer className="h-4 w-4" /> Print / Save PDF
        </button>
      </div>

      <div className="mt-6 space-y-6 rounded-xl border border-border bg-card p-6 print:border-0 print:p-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0" />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title (e.g. Frontend Developer)" className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0" />
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Email · phone · city · LinkedIn" className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0 sm:col-span-2" />
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Professional summary — 2-3 lines about you" className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring print:border-0 sm:col-span-2" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Experience</h2>
            <button type="button" onClick={() => setJobs([...jobs, { id: Date.now(), role: "", company: "", period: "", points: "" }])} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-secondary print:hidden">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="space-y-4">
            {jobs.map((j) => (
              <div key={j.id} className="rounded-lg border border-border/60 p-3 print:border-0 print:p-0">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <input value={j.role} onChange={(e) => setJobs(jobs.map((x) => x.id === j.id ? { ...x, role: e.target.value } : x))} placeholder="Role" className="rounded border border-input bg-background p-2 text-sm outline-none print:border-0" />
                  <input value={j.company} onChange={(e) => setJobs(jobs.map((x) => x.id === j.id ? { ...x, company: e.target.value } : x))} placeholder="Company" className="rounded border border-input bg-background p-2 text-sm outline-none print:border-0" />
                  <div className="flex gap-2">
                    <input value={j.period} onChange={(e) => setJobs(jobs.map((x) => x.id === j.id ? { ...x, period: e.target.value } : x))} placeholder="2022 – Present" className="w-full rounded border border-input bg-background p-2 text-sm outline-none print:border-0" />
                    <button type="button" onClick={() => setJobs(jobs.filter((x) => x.id !== j.id))} className="text-muted-foreground transition-colors hover:text-destructive print:hidden" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <textarea value={j.points} onChange={(e) => setJobs(jobs.map((x) => x.id === j.id ? { ...x, points: e.target.value } : x))} rows={2} placeholder="Key achievements (one per line)" className="mt-2 w-full rounded border border-input bg-background p-2 text-sm outline-none print:border-0" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">Skills</h2>
          <div className="flex flex-wrap items-center gap-2">
            {skills.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                {s.name}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x.id !== s.id))} className="text-muted-foreground hover:text-destructive print:hidden">✕</button>
              </span>
            ))}
            <input
              placeholder="Type a skill and press Enter…"
              className="rounded border border-input bg-background p-1.5 text-xs outline-none print:border-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  setSkills([...skills, { id: Date.now(), name: e.currentTarget.value.trim() }]);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
