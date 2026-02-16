import { getProjectStatus } from "@/lib/storage";

const statusColor: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-warning/15 text-warning-foreground",
  Shipped: "bg-success/15 text-success",
};

export default function TopBar() {
  const status = getProjectStatus();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <span className="font-serif text-lg font-bold tracking-tight">KodNest</span>
      <span className="text-sm text-muted-foreground hidden sm:block">Placement Readiness Platform</span>
      <span className={`rounded-md px-3 py-1 text-xs font-semibold ${statusColor[status]}`}>
        {status}
      </span>
    </header>
  );
}
