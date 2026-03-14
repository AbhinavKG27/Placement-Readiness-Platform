import { Moon, Sun } from "lucide-react";
import { getProjectStatus } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { useAppTheme } from "@/hooks/use-app-theme";

const statusColor: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-warning/15 text-warning-foreground",
  Shipped: "bg-success/15 text-success",
};

export default function TopBar() {
  const navigate = useNavigate();
  const status = getProjectStatus();
  const { isDark, toggle } = useAppTheme();

  return (
    <header className="navbar flex items-center justify-between px-6">
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 rounded-md border-0 bg-transparent p-0 text-left"
        aria-label="Go to home"
      >
        <span className="nav-logo-mark inline-flex h-8 w-8 items-center justify-center text-sm font-semibold font-mono">K</span>
        <span className="font-display text-lg font-semibold tracking-tight italic">KodNest</span>
      </button>
      <span className="hidden text-sm text-muted-foreground sm:block">Placement Readiness Platform</span>
      <div className="flex items-center gap-3">
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
          <span className="toggle-pill">
            <span className="toggle-circle">{isDark ? <Moon size={12} /> : <Sun size={12} />}</span>
          </span>
          <span className="toggle-label">{isDark ? "Dark" : "Light"}</span>
        </button>
        <span className={`rounded-md px-3 py-1 text-xs font-semibold ${statusColor[status]}`}>{status}</span>
      </div>
    </header>
  );
}