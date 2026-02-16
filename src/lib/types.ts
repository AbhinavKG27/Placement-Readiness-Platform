export interface ExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

export interface RoundMapping {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

export interface ChecklistRound {
  roundTitle: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  roundMapping: RoundMapping[];
  checklist: ChecklistRound[];
  plan7Days: DayPlan[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: Record<string, "know" | "practice">;
  finalScore: number;
  updatedAt: string;
}

export interface ProofSubmission {
  lovableLink: string;
  githubLink: string;
  deployedLink: string;
}

export interface ProofFooterState {
  uiBuilt: boolean;
  logicWorking: boolean;
  testPassed: boolean;
  deployed: boolean;
}
