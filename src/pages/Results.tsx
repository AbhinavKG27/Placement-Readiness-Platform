import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Copy, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEntry, getLatestEntry, updateEntry } from "@/lib/storage";
import { calculateFinalScore, getCompanySize, getIndustry } from "@/lib/analysis";
import type { AnalysisEntry, ExtractedSkills } from "@/lib/types";

const CATEGORY_LABELS: Record<keyof ExtractedSkills, string> = {
  coreCS: "Core CS",
  languages: "Languages",
  web: "Web",
  data: "Data",
  cloud: "Cloud / DevOps",
  testing: "Testing",
  other: "Other",
};

function CircularScore({ value }: { value: number }) {
  const size = 120;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-300 ease-in-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl font-bold">{value}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export default function Results() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get("id");

  const [entry, setEntry] = useState<AnalysisEntry | null>(null);

  useEffect(() => {
    const e = id ? getEntry(id) : getLatestEntry();
    if (!e) {
      navigate("/");
      return;
    }
    setEntry(e);
  }, [id, navigate]);

  const persist = useCallback((updated: AnalysisEntry) => {
    updateEntry(updated);
    setEntry({ ...updated });
  }, []);

  const toggleSkill = (skill: string) => {
    if (!entry) return;
    const current = entry.skillConfidenceMap[skill] || "practice";
    const next = current === "know" ? "practice" : "know";
    const newMap = { ...entry.skillConfidenceMap, [skill]: next as "know" | "practice" };
    const newScore = calculateFinalScore(entry.baseScore, newMap);
    persist({ ...entry, skillConfidenceMap: newMap, finalScore: newScore, updatedAt: new Date().toISOString() });
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard.`);
  };

  const downloadTxt = () => {
    if (!entry) return;
    const lines: string[] = [];
    lines.push("=== Placement Readiness Analysis ===\n");
    if (entry.company) lines.push(`Company: ${entry.company}`);
    if (entry.role) lines.push(`Role: ${entry.role}`);
    lines.push(`Readiness Score: ${entry.finalScore}/100\n`);
    lines.push("--- 7-Day Plan ---");
    entry.plan7Days.forEach((d) => { lines.push(`\n${d.day}: ${d.focus}`); d.tasks.forEach((t) => lines.push(`  • ${t}`)); });
    lines.push("\n--- Round Checklist ---");
    entry.checklist.forEach((r) => { lines.push(`\n${r.roundTitle}`); r.items.forEach((i) => lines.push(`  □ ${i}`)); });
    lines.push("\n--- Interview Questions ---");
    entry.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `readiness-${entry.company || "analysis"}.txt`;
    a.click();
  };

  if (!entry) return null;

  const companySize = getCompanySize(entry.company);
  const industry = getIndustry(entry.company);
  const weakSkills = Object.entries(entry.skillConfidenceMap).filter(([, v]) => v === "practice").map(([k]) => k).slice(0, 3);

  const planText = entry.plan7Days.map((d) => `${d.day}: ${d.focus}\n${d.tasks.map((t) => `  • ${t}`).join("\n")}`).join("\n\n");
  const checklistText = entry.checklist.map((r) => `${r.roundTitle}\n${r.items.map((i) => `  □ ${i}`).join("\n")}`).join("\n\n");
  const questionsText = entry.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");

  return (
    <div>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="mb-1 text-2xl">Analysis Results</h1>
          <p className="text-sm text-muted-foreground">
            {entry.company && <span className="font-medium text-foreground">{entry.company}</span>}
            {entry.role && <span> — {entry.role}</span>}
            {!entry.company && !entry.role && "General analysis"}
          </p>
        </div>
        <CircularScore value={entry.finalScore} />
      </div>

      {/* Company Intel */}
      {entry.company && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Company Intel</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div><span className="text-muted-foreground">Company</span><p className="font-medium">{entry.company}</p></div>
              <div><span className="text-muted-foreground">Industry</span><p className="font-medium">{industry}</p></div>
              <div><span className="text-muted-foreground">Estimated Size</span><p className="font-medium">{companySize}</p></div>
            </div>
            <div className="mt-4 rounded-md bg-muted/50 p-4 text-sm">
              <p className="mb-1 font-semibold">Typical Hiring Focus</p>
              <p className="text-muted-foreground">
                {companySize === "Enterprise"
                  ? "Structured rounds with emphasis on DSA, core fundamentals, and behavioral alignment."
                  : companySize === "Mid-size"
                  ? "Balanced approach with coding challenges, system thinking, and team fit assessment."
                  : "Practical problem solving and depth in specific tech stacks. Ownership mindset valued."}
              </p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground italic">Demo Mode: Company intel generated heuristically.</p>
          </CardContent>
        </Card>
      )}

      {/* Extracted Skills */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Key Skills Extracted</CardTitle></CardHeader>
        <CardContent>
          {(Object.entries(entry.extractedSkills) as [keyof ExtractedSkills, string[]][])
            .filter(([, skills]) => skills.length > 0)
            .map(([cat, skills]) => (
              <div key={cat} className="mb-4 last:mb-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{CATEGORY_LABELS[cat]}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const conf = entry.skillConfidenceMap[skill] || "practice";
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-default ${
                          conf === "know"
                            ? "border-success/40 bg-success/10 text-success"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {skill}
                        <span className="ml-1.5 opacity-60">{conf === "know" ? "✓" : "•"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          <p className="mt-4 text-xs text-muted-foreground">Click a skill to toggle between "I know this" and "Need practice".</p>
        </CardContent>
      </Card>

      {/* Round Mapping */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Round Mapping</CardTitle></CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-border pl-6">
            {entry.roundMapping.map((round, i) => (
              <div key={i} className="relative mb-8 last:mb-0">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-card" />
                <h3 className="mb-1 text-base">{round.roundTitle}</h3>
                <div className="mb-2 flex flex-wrap gap-2">
                  {round.focusAreas.map((f) => (
                    <span key={f} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{f}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{round.whyItMatters}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>7-Day Preparation Plan</CardTitle>
          <button onClick={() => copyText(planText, "7-day plan")} className="text-muted-foreground hover:text-foreground transition-default"><Copy size={16} /></button>
        </CardHeader>
        <CardContent>
          {entry.plan7Days.map((d) => (
            <div key={d.day} className="mb-4 last:mb-0">
              <p className="mb-1 font-semibold">{d.day} — <span className="font-normal text-muted-foreground">{d.focus}</span></p>
              <ul className="ml-4 list-disc text-sm text-muted-foreground">
                {d.tasks.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Round-wise Checklist</CardTitle>
          <button onClick={() => copyText(checklistText, "Checklist")} className="text-muted-foreground hover:text-foreground transition-default"><Copy size={16} /></button>
        </CardHeader>
        <CardContent>
          {entry.checklist.map((r) => (
            <div key={r.roundTitle} className="mb-4 last:mb-0">
              <p className="mb-2 font-semibold">{r.roundTitle}</p>
              <ul className="space-y-1">
                {r.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 shrink-0 text-xs">□</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Questions */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>10 Likely Interview Questions</CardTitle>
          <button onClick={() => copyText(questionsText, "Questions")} className="text-muted-foreground hover:text-foreground transition-default"><Copy size={16} /></button>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {entry.questions.map((q, i) => <li key={i}>{q}</li>)}
          </ol>
        </CardContent>
      </Card>

      {/* Export */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={() => copyText(planText, "7-day plan")} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-default hover:bg-accent"><Copy size={14} /> Copy 7-day plan</button>
        <button onClick={() => copyText(checklistText, "Checklist")} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-default hover:bg-accent"><Copy size={14} /> Copy round checklist</button>
        <button onClick={() => copyText(questionsText, "Questions")} className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-default hover:bg-accent"><Copy size={14} /> Copy 10 questions</button>
        <button onClick={downloadTxt} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-default hover:opacity-90"><Download size={14} /> Download as TXT</button>
      </div>

      {/* Action Next */}
      <Card>
        <CardHeader><CardTitle>What to do next</CardTitle></CardHeader>
        <CardContent>
          {weakSkills.length > 0 ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">Your top areas needing practice:</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {weakSkills.map((s) => (
                  <span key={s} className="flex items-center gap-1 rounded-md border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning-foreground">
                    <AlertCircle size={12} /> {s}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="mb-3 flex items-center gap-2 text-sm text-success">
              <CheckCircle2 size={16} /> All skills marked as known. Great preparation!
            </p>
          )}
          <p className="rounded-md bg-muted/50 px-4 py-3 text-sm font-medium">
            Start Day 1 plan now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
