import { useEffect, useState } from "react";
import { getProofFooter, saveProofFooter } from "@/lib/storage";
import type { ProofFooterState } from "@/lib/types";

const ITEMS: { key: keyof ProofFooterState; label: string }[] = [
  { key: "uiBuilt", label: "UI Built" },
  { key: "logicWorking", label: "Logic Working" },
  { key: "testPassed", label: "Test Passed" },
  { key: "deployed", label: "Deployed" },
];

export default function ProofFooter() {
  const [state, setState] = useState<ProofFooterState>(getProofFooter);

  useEffect(() => {
    saveProofFooter(state);
  }, [state]);

  const toggle = (key: keyof ProofFooterState) =>
    setState((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <footer className="border-t border-border bg-card px-6 py-3">
      <div className="flex flex-wrap items-center gap-6">
        {ITEMS.map(({ key, label }) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-sm select-none"
          >
            <input
              type="checkbox"
              checked={state[key]}
              onChange={() => toggle(key)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className={state[key] ? "text-foreground" : "text-muted-foreground"}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </footer>
  );
}
