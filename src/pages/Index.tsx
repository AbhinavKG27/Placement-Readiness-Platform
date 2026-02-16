import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code, Video, BarChart3, ArrowRight } from "lucide-react";
import { analyzeJD } from "@/lib/analysis";
import { saveToHistory } from "@/lib/storage";

const FEATURES = [
  { icon: Code, title: "Practice Problems", desc: "Curated coding challenges aligned to placement patterns." },
  { icon: Video, title: "Mock Interviews", desc: "Simulate real interview rounds with structured feedback." },
  { icon: BarChart3, title: "Track Progress", desc: "Visualize your readiness across every skill area." },
];

export default function Index() {
  const navigate = useNavigate();
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [warning, setWarning] = useState("");

  const handleAnalyze = () => {
    if (!jd.trim()) {
      setWarning("Job description is required.");
      return;
    }
    if (jd.trim().length < 200) {
      setWarning("This JD is too short to analyze deeply. Paste the full JD for better output.");
    } else {
      setWarning("");
    }
    const entry = analyzeJD(jd, company, role);
    saveToHistory(entry);
    navigate(`/results?id=${entry.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-16">
        <span className="font-serif text-xl font-bold">KodNest</span>
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-default hover:opacity-90"
        >
          Dashboard
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-24 pb-16 text-center">
        <h1 className="mb-4 max-w-2xl text-4xl leading-tight md:text-5xl">
          Ace Your Placement
        </h1>
        <p className="mb-10 max-w-xl text-lg text-muted-foreground">
          Practice, assess, and prepare for your dream job.
        </p>
        <a
          href="#analyze"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-default hover:opacity-90"
        >
          Get Started <ArrowRight size={18} />
        </a>
      </section>

      {/* Analyze Section */}
      <section
        id="analyze"
        className="mx-auto max-w-2xl px-6 pb-20"
      >
        <h2 className="mb-2 text-center text-2xl">Analyze a Job Description</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Paste a JD to get a personalized preparation plan.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name (optional)"
              className="rounded-md border border-input bg-card px-4 py-2.5 text-sm outline-none transition-default focus:border-primary focus:ring-1 focus:ring-ring"
            />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role (optional)"
              className="rounded-md border border-input bg-card px-4 py-2.5 text-sm outline-none transition-default focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>
          <textarea
            value={jd}
            onChange={(e) => { setJd(e.target.value); setWarning(""); }}
            rows={10}
            placeholder="Paste the full job description here…"
            className="w-full rounded-md border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none transition-default focus:border-primary focus:ring-1 focus:ring-ring"
          />
          {warning && (
            <p className="rounded-md bg-warning/10 px-4 py-2 text-sm text-warning-foreground">
              {warning}
            </p>
          )}
          <button
            onClick={handleAnalyze}
            className="w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground transition-default hover:opacity-90"
          >
            Analyze
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border p-6 text-center">
              <div className="mb-4 inline-flex rounded-md bg-primary/10 p-3">
                <Icon size={24} className="text-primary" />
              </div>
              <h3 className="mb-2 text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} KodNest. All rights reserved.
      </footer>
    </div>
  );
}
