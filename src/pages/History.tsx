import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import type { AnalysisEntry } from "@/lib/types";
import { Clock, ChevronRight } from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<AnalysisEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setEntries(getHistory());
    } catch {
      setError("One saved entry couldn't be loaded. Create a new analysis.");
    }
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-2xl">Analysis History</h1>
      <p className="mb-10 text-muted-foreground">Your saved JD analyses.</p>

      {error && (
        <p className="mb-6 rounded-md bg-warning/10 px-4 py-2 text-sm text-warning-foreground">{error}</p>
      )}

      {entries.length === 0 && !error ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="mb-2 text-muted-foreground">No analyses yet.</p>
            <button
              onClick={() => navigate("/")}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-default hover:opacity-90"
            >
              Analyze a JD
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => (
            <button
              key={e.id}
              onClick={() => navigate(`/results?id=${e.id}`)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-6 py-4 text-left transition-default hover:border-primary/20"
            >
              <div>
                <p className="font-medium">{e.company || "Untitled"}{e.role && ` — ${e.role}`}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {new Date(e.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-primary/10 px-3 py-1 font-serif text-sm font-bold text-primary">
                  {e.finalScore}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
