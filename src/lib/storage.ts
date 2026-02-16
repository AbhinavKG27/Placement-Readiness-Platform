import type { AnalysisEntry, ProofSubmission, ProofFooterState } from "./types";

const HISTORY_KEY = "prp_analysis_history";
const CHECKLIST_KEY = "prp_test_checklist";
const SUBMISSION_KEY = "prp_final_submission";
const FOOTER_KEY = "prp_proof_footer";

// --- Analysis History ---
export function getHistory(): AnalysisEntry[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed)
      ? parsed.filter((e: any) => e && e.id && e.createdAt)
      : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: AnalysisEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getEntry(id: string): AnalysisEntry | null {
  return getHistory().find((e) => e.id === id) ?? null;
}

export function getLatestEntry(): AnalysisEntry | null {
  const h = getHistory();
  return h.length > 0 ? h[0] : null;
}

export function updateEntry(updated: AnalysisEntry): void {
  const history = getHistory();
  const idx = history.findIndex((e) => e.id === updated.id);
  if (idx >= 0) {
    history[idx] = updated;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

// --- Test Checklist ---
export function getTestChecklist(): boolean[] {
  try {
    const data = localStorage.getItem(CHECKLIST_KEY);
    if (!data) return new Array(10).fill(false);
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length === 10
      ? parsed
      : new Array(10).fill(false);
  } catch {
    return new Array(10).fill(false);
  }
}

export function saveTestChecklist(items: boolean[]): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
}

// --- Proof Submission ---
export function getProofSubmission(): ProofSubmission {
  try {
    const data = localStorage.getItem(SUBMISSION_KEY);
    if (!data) return { lovableLink: "", githubLink: "", deployedLink: "" };
    return JSON.parse(data);
  } catch {
    return { lovableLink: "", githubLink: "", deployedLink: "" };
  }
}

export function saveProofSubmission(sub: ProofSubmission): void {
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(sub));
}

// --- Proof Footer ---
export function getProofFooter(): ProofFooterState {
  try {
    const data = localStorage.getItem(FOOTER_KEY);
    if (!data)
      return {
        uiBuilt: false,
        logicWorking: false,
        testPassed: false,
        deployed: false,
      };
    return JSON.parse(data);
  } catch {
    return {
      uiBuilt: false,
      logicWorking: false,
      testPassed: false,
      deployed: false,
    };
  }
}

export function saveProofFooter(state: ProofFooterState): void {
  localStorage.setItem(FOOTER_KEY, JSON.stringify(state));
}

// --- Computed Status ---
export function getProjectStatus(): "Not Started" | "In Progress" | "Shipped" {
  const checklist = getTestChecklist();
  const submission = getProofSubmission();
  const footer = getProofFooter();

  const allChecked = checklist.every(Boolean);
  const allLinks =
    submission.lovableLink && submission.githubLink && submission.deployedLink;
  const allFooter =
    footer.uiBuilt && footer.logicWorking && footer.testPassed && footer.deployed;

  if (allChecked && allLinks && allFooter) return "Shipped";

  const anyWork =
    getHistory().length > 0 ||
    checklist.some(Boolean) ||
    submission.lovableLink ||
    submission.githubLink ||
    submission.deployedLink;

  return anyWork ? "In Progress" : "Not Started";
}
