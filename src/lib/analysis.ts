import type {
  AnalysisEntry,
  ExtractedSkills,
  RoundMapping,
  ChecklistRound,
  DayPlan,
} from "./types";

// ---- Skill keyword maps ----
const SKILL_MAP: Record<keyof Omit<ExtractedSkills, "other">, { keywords: string[]; label: string }> = {
  coreCS: {
    label: "Core CS",
    keywords: ["dsa", "data structure", "algorithm", "oop", "object oriented", "dbms", "database management", "operating system", "computer network", "networking"],
  },
  languages: {
    label: "Languages",
    keywords: ["java", "python", "javascript", "typescript", "c++", "c#", "golang", "go lang", " c "],
  },
  web: {
    label: "Web",
    keywords: ["react", "next.js", "nextjs", "node.js", "nodejs", "express", "rest", "restful", "graphql", "angular", "vue", "html", "css"],
  },
  data: {
    label: "Data",
    keywords: ["sql", "mongodb", "postgresql", "mysql", "redis", "nosql", "database"],
  },
  cloud: {
    label: "Cloud / DevOps",
    keywords: ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "cicd", "linux", "devops", "jenkins", "terraform"],
  },
  testing: {
    label: "Testing",
    keywords: ["selenium", "cypress", "playwright", "junit", "pytest", "testing", "jest", "mocha"],
  },
};

function matchKeyword(text: string, kw: string): boolean {
  return text.includes(kw.toLowerCase());
}

export function extractSkills(jdText: string): ExtractedSkills {
  const lower = ` ${jdText.toLowerCase()} `;
  const result: ExtractedSkills = { coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: [] };

  for (const [cat, { keywords }] of Object.entries(SKILL_MAP) as [keyof Omit<ExtractedSkills, "other">, { keywords: string[] }][]) {
    for (const kw of keywords) {
      if (matchKeyword(lower, kw)) {
        const display = kw.trim().replace(/^\w/, (c) => c.toUpperCase());
        if (!result[cat].includes(display)) result[cat].push(display);
      }
    }
  }

  const allEmpty = Object.values(result).every((arr) => arr.length === 0);
  if (allEmpty) {
    result.other = ["Communication", "Problem Solving", "Basic Coding", "Projects"];
  }

  return result;
}

function allSkills(skills: ExtractedSkills): string[] {
  return [
    ...skills.coreCS, ...skills.languages, ...skills.web,
    ...skills.data, ...skills.cloud, ...skills.testing, ...skills.other,
  ];
}

// ---- Company Intel ----
const ENTERPRISES = ["amazon", "google", "microsoft", "meta", "apple", "netflix", "infosys", "tcs", "wipro", "hcl", "cognizant", "accenture", "deloitte", "ibm", "oracle", "salesforce", "adobe", "uber", "flipkart", "walmart", "goldman sachs", "jp morgan", "morgan stanley", "paypal", "cisco", "intel", "qualcomm", "samsung"];
const MIDSIZE = ["razorpay", "cred", "swiggy", "zomato", "paytm", "phonepe", "dream11", "meesho", "groww", "slice", "jupiter", "lenskart", "nykaa", "byju"];

export type CompanySize = "Startup" | "Mid-size" | "Enterprise";

export function getCompanySize(company: string): CompanySize {
  if (!company) return "Startup";
  const lower = company.toLowerCase().trim();
  if (ENTERPRISES.some((e) => lower.includes(e))) return "Enterprise";
  if (MIDSIZE.some((e) => lower.includes(e))) return "Mid-size";
  return "Startup";
}

export function getIndustry(company: string): string {
  const lower = (company || "").toLowerCase();
  if (["goldman", "jp morgan", "morgan stanley", "paypal", "razorpay", "groww", "slice"].some((k) => lower.includes(k))) return "Financial Services";
  if (["swiggy", "zomato"].some((k) => lower.includes(k))) return "Food & Delivery";
  if (["flipkart", "amazon", "walmart", "meesho", "nykaa", "lenskart"].some((k) => lower.includes(k))) return "E-Commerce";
  return "Technology Services";
}

// ---- Round Mapping ----
export function generateRoundMapping(skills: ExtractedSkills, size: CompanySize): RoundMapping[] {
  const hasDSA = skills.coreCS.length > 0;
  const hasWeb = skills.web.length > 0;

  if (size === "Enterprise") {
    return [
      { roundTitle: "Round 1 — Online Test", focusAreas: ["Aptitude", "DSA", "Core CS MCQs"], whyItMatters: "Filters candidates at scale. Focus on speed and accuracy with fundamentals." },
      { roundTitle: "Round 2 — Technical Interview", focusAreas: hasDSA ? ["DSA Problem Solving", "Core CS Concepts"] : ["Coding Basics", "Problem Solving"], whyItMatters: "Tests depth of understanding. Expect whiteboard-style problem solving." },
      { roundTitle: "Round 3 — Tech + Projects", focusAreas: hasWeb ? ["Project Walkthrough", "Stack-specific Questions"] : ["Project Discussion", "System Thinking"], whyItMatters: "Evaluates practical experience and communication about technical decisions." },
      { roundTitle: "Round 4 — HR / Managerial", focusAreas: ["Behavioral Questions", "Company Values", "Salary Discussion"], whyItMatters: "Assesses cultural fit and long-term alignment." },
    ];
  }

  if (size === "Mid-size") {
    return [
      { roundTitle: "Round 1 — Online Assessment", focusAreas: ["Coding Challenge", "Aptitude"], whyItMatters: "Initial screening to test baseline coding and logical skills." },
      { roundTitle: "Round 2 — Technical Interview", focusAreas: hasWeb ? ["Stack-specific Coding", "System Design Basics"] : ["DSA", "Problem Solving"], whyItMatters: "Deep dive into your technical abilities and approach to problems." },
      { roundTitle: "Round 3 — Managerial", focusAreas: ["Team Fit", "Project Experience", "Growth Mindset"], whyItMatters: "Tests how well you communicate and collaborate." },
      { roundTitle: "Round 4 — HR", focusAreas: ["Expectations", "Role Alignment"], whyItMatters: "Final alignment on role, compensation, and joining." },
    ];
  }

  // Startup
  return [
    { roundTitle: "Round 1 — Practical Coding", focusAreas: hasWeb ? ["Live Coding (Frontend/Backend)"] : ["Algorithm Implementation", "Code Quality"], whyItMatters: "Startups value speed. Show you can build working code quickly." },
    { roundTitle: "Round 2 — System Discussion", focusAreas: ["Architecture Thinking", "Trade-offs", "Scalability Basics"], whyItMatters: "Even at junior level, startups want people who think beyond code." },
    { roundTitle: "Round 3 — Culture Fit", focusAreas: ["Ownership Mindset", "Learning Agility", "Side Projects"], whyItMatters: "Startups need self-starters who thrive in ambiguity." },
  ];
}

// ---- Checklist ----
export function generateChecklist(skills: ExtractedSkills, rounds: RoundMapping[]): ChecklistRound[] {
  const hasLang = skills.languages.length > 0;
  const hasWeb = skills.web.length > 0;
  const hasData = skills.data.length > 0;

  return rounds.map((round) => {
    const items: string[] = [];
    if (round.roundTitle.includes("Online") || round.roundTitle.includes("Aptitude")) {
      items.push("Practice aptitude: quant, logical, verbal", "Solve 20+ easy-medium DSA problems", "Time yourself — aim for 70% accuracy under 45 mins", "Revise number systems and probability", "Practice pattern-based MCQs");
    } else if (round.roundTitle.includes("Technical") || round.roundTitle.includes("Coding")) {
      items.push("Revise top 50 DSA patterns (arrays, trees, graphs, DP)");
      if (hasLang) items.push(`Practice in: ${skills.languages.join(", ")}`);
      items.push("Solve 2 medium problems daily", "Explain approach before coding", "Practice dry-running your code");
      if (hasWeb) items.push(`Review ${skills.web.join(", ")} concepts`);
      if (hasData) items.push(`Review ${skills.data.join(", ")} query patterns`);
    } else if (round.roundTitle.includes("Project") || round.roundTitle.includes("System")) {
      items.push("Prepare 2-minute walkthrough of your best project", "Know every tech decision and trade-off", "Be ready for 'How would you scale this?'", "Prepare a system design diagram if applicable", "Practice explaining architecture to non-tech audience");
    } else if (round.roundTitle.includes("HR") || round.roundTitle.includes("Culture") || round.roundTitle.includes("Managerial")) {
      items.push("Prepare STAR-format answers for 5 behavioral questions", "Research company mission and recent news", "Prepare 'Why this company?' answer", "Know your salary expectations and negotiation points", "Prepare thoughtful questions for the interviewer");
    }
    if (items.length < 5) items.push("Review fundamentals", "Practice mock scenarios", "Get peer feedback", "Rest well before the round", "Stay calm and structured");
    return { roundTitle: round.roundTitle, items: items.slice(0, 8) };
  });
}

// ---- 7-Day Plan ----
export function generate7DayPlan(skills: ExtractedSkills): DayPlan[] {
  const hasWeb = skills.web.length > 0;
  const hasData = skills.data.length > 0;
  const hasCloud = skills.cloud.length > 0;

  return [
    { day: "Day 1", focus: "Fundamentals + Core CS", tasks: ["Revise OOP concepts", "Review OS basics (processes, threads, memory)", "DBMS: normalization, ACID, indexing", "Networking: OSI model, TCP/UDP, HTTP"] },
    { day: "Day 2", focus: "Core CS continued + Language Prep", tasks: ["Practice 10 MCQs on core CS", `Revise syntax of ${skills.languages.length > 0 ? skills.languages[0] : "your primary language"}`, "Understand time/space complexity basics", "Solve 5 easy problems"] },
    { day: "Day 3", focus: "DSA — Arrays, Strings, Hashing", tasks: ["Two-pointer and sliding window patterns", "Hash map based problems", "Practice 5 medium problems", "Write clean, commented code"] },
    { day: "Day 4", focus: "DSA — Trees, Graphs, DP", tasks: ["BFS/DFS traversal patterns", "Basic DP: fibonacci, knapsack, LCS", "Practice 5 medium problems", "Focus on explaining your approach"] },
    { day: "Day 5", focus: "Project + Resume Alignment", tasks: ["Polish your best project's README", "Prepare 2-min project walkthrough", hasWeb ? "Review React/Node concepts for project stack" : "Review your project's tech stack", "Update resume with quantified achievements"] },
    { day: "Day 6", focus: "Mock Interview + Soft Skills", tasks: ["Do a timed mock DSA round (45 mins, 2 problems)", "Practice behavioral questions (STAR format)", hasData ? "Review SQL queries and joins" : "Review data handling concepts", hasCloud ? "Review deployment and CI/CD flow" : "Review basic deployment concepts"] },
    { day: "Day 7", focus: "Revision + Weak Areas", tasks: ["Re-solve problems you struggled with", "Review all notes from the week", "Light practice — don't over-stress", "Sleep well, stay hydrated, stay confident"] },
  ];
}

// ---- Questions ----
const Q_BANK: Record<string, string[]> = {
  dsa: ["How would you optimize search in sorted data?", "Explain the time complexity of quicksort.", "How do you detect a cycle in a linked list?", "When would you use a stack vs a queue?"],
  oop: ["Explain SOLID principles with examples.", "Difference between abstract class and interface?"],
  dbms: ["What is normalization? Explain 3NF.", "Explain ACID properties."],
  sql: ["Explain indexing and when it helps.", "Write a query to find the second highest salary."],
  mongodb: ["When would you choose MongoDB over SQL?", "Explain aggregation pipelines."],
  react: ["Explain state management options in React.", "What are hooks and their rules?", "How does the virtual DOM work?"],
  "node.js": ["Explain the event loop in Node.js.", "How do you handle errors in Express?"],
  nodejs: ["Explain the event loop in Node.js.", "How do you handle errors in Express?"],
  python: ["Explain list comprehensions.", "What are Python decorators?"],
  java: ["Explain JVM memory management.", "Difference between HashMap and TreeMap?"],
  javascript: ["Explain closures with an example.", "What is the event loop in JavaScript?"],
  typescript: ["What are generics in TypeScript?", "Explain union vs intersection types."],
  aws: ["Explain EC2 vs Lambda.", "What is S3 and when would you use it?"],
  docker: ["What is a Docker container vs image?", "How does Docker networking work?"],
  kubernetes: ["Explain pods and services.", "What is a deployment in Kubernetes?"],
  rest: ["Explain REST principles.", "Difference between PUT and PATCH?"],
  graphql: ["How does GraphQL differ from REST?", "What are resolvers?"],
  linux: ["Explain file permissions in Linux.", "What is a process vs a thread?"],
  "operating system": ["Explain deadlock and how to prevent it.", "What is virtual memory?"],
  "computer network": ["Explain TCP 3-way handshake.", "What is DNS?"],
  networking: ["Explain TCP 3-way handshake.", "What is DNS?"],
  "problem solving": ["Describe your approach to debugging a complex issue.", "How do you break down a large problem?"],
  communication: ["How would you explain a technical concept to a non-technical stakeholder?"],
  "basic coding": ["Write a function to reverse a string.", "Explain the difference between iteration and recursion."],
};

export function generateQuestions(skills: ExtractedSkills): string[] {
  const all = allSkills(skills);
  const questions: string[] = [];

  for (const skill of all) {
    const key = skill.toLowerCase().trim();
    const bank = Q_BANK[key];
    if (bank) {
      for (const q of bank) {
        if (!questions.includes(q)) questions.push(q);
        if (questions.length >= 10) return questions;
      }
    }
  }

  // Fallback generic questions
  const fallback = [
    "Tell me about yourself and your background.",
    "What project are you most proud of and why?",
    "How do you handle tight deadlines?",
    "Describe a time you solved a difficult technical problem.",
    "Where do you see yourself in 3 years?",
    "What motivates you to work in technology?",
    "How do you stay updated with new technologies?",
    "Describe your ideal team environment.",
    "What is your approach to learning something new?",
    "Why should we hire you?",
  ];

  for (const q of fallback) {
    if (!questions.includes(q)) questions.push(q);
    if (questions.length >= 10) break;
  }

  return questions.slice(0, 10);
}

// ---- Scoring ----
export function calculateBaseScore(skills: ExtractedSkills, company: string, role: string, jdText: string): number {
  let score = 35;
  const categories = [skills.coreCS, skills.languages, skills.web, skills.data, skills.cloud, skills.testing];
  const filledCategories = categories.filter((c) => c.length > 0).length;
  score += Math.min(filledCategories * 5, 30);
  if (company.trim()) score += 10;
  if (role.trim()) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

export function calculateFinalScore(baseScore: number, confidenceMap: Record<string, "know" | "practice">): number {
  let delta = 0;
  for (const v of Object.values(confidenceMap)) {
    delta += v === "know" ? 2 : -2;
  }
  return Math.max(0, Math.min(100, baseScore + delta));
}

function initConfidenceMap(skills: ExtractedSkills): Record<string, "know" | "practice"> {
  const map: Record<string, "know" | "practice"> = {};
  for (const skill of allSkills(skills)) {
    map[skill] = "practice";
  }
  return map;
}

// ---- Main Analyze ----
export function analyzeJD(jdText: string, company: string, role: string): AnalysisEntry {
  const skills = extractSkills(jdText);
  const size = getCompanySize(company);
  const roundMapping = generateRoundMapping(skills, size);
  const checklist = generateChecklist(skills, roundMapping);
  const plan = generate7DayPlan(skills);
  const questions = generateQuestions(skills);
  const baseScore = calculateBaseScore(skills, company, role, jdText);
  const confidenceMap = initConfidenceMap(skills);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    company,
    role,
    jdText,
    extractedSkills: skills,
    roundMapping,
    checklist,
    plan7Days: plan,
    questions,
    baseScore,
    skillConfidenceMap: confidenceMap,
    finalScore: baseScore,
    updatedAt: new Date().toISOString(),
  };
}
