import { useState, useEffect } from "react";
import { getTestChecklist, saveTestChecklist } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TESTS = [
  { label: "JD required validation works", hint: "Submit empty JD on home page — should show error." },
  { label: "Short JD warning shows for <200 chars", hint: "Paste a very short JD and click Analyze." },
  { label: "Skills extraction groups correctly", hint: "Paste a JD with React, SQL, Docker — check categories." },
  { label: "Round mapping changes based on company + skills", hint: "Try 'Amazon' vs unknown startup — rounds should differ." },
  { label: "Score calculation is deterministic", hint: "Same JD + inputs should produce same base score." },
  { label: "Skill toggles update score live", hint: "Toggle skills on /results — score should change instantly." },
  { label: "Changes persist after refresh", hint: "Toggle skills, refresh page — toggles and score should remain." },
  { label: "History saves and loads correctly", hint: "Analyze a JD, go to History, click entry — should load." },
  { label: "Export buttons copy the correct content", hint: "Click copy buttons and paste into a text editor." },
  { label: "No console errors on core pages", hint: "Open browser DevTools and navigate through all pages." },
];

export default function TestChecklist() {
  const [items, setItems] = useState<boolean[]>(getTestChecklist);

  useEffect(() => {
    saveTestChecklist(items);
  }, [items]);

  const toggle = (i: number) => {
    setItems((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const reset = () => setItems(new Array(10).fill(false));
  const passed = items.filter(Boolean).length;

  return (
    <div>
      <h1 className="mb-2 text-2xl">Test Checklist</h1>
      <p className="mb-6 text-muted-foreground">Verify each item before shipping.</p>

      <div className="mb-6 flex items-center justify-between">
        <span className="font-serif text-lg font-bold">
          Tests Passed: {passed} / 10
        </span>
        <button onClick={reset} className="text-sm text-muted-foreground underline hover:text-foreground transition-default">
          Reset checklist
        </button>
      </div>

      {passed < 10 && (
        <p className="mb-6 rounded-md bg-warning/10 px-4 py-2 text-sm text-warning-foreground">
          Fix issues before shipping.
        </p>
      )}

      <Card>
        <CardContent className="divide-y divide-border py-0">
          {TESTS.map((test, i) => (
            <label key={i} className="flex cursor-pointer items-start gap-4 py-4">
              <input
                type="checkbox"
                checked={items[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
              />
              <div>
                <p className={`text-sm font-medium ${items[i] ? "text-foreground" : "text-muted-foreground"}`}>{test.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{test.hint}</p>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
