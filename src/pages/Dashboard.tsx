import { getLatestEntry } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_RADAR = [
  { skill: "DSA", value: 75 },
  { skill: "System Design", value: 60 },
  { skill: "Communication", value: 80 },
  { skill: "Resume", value: 85 },
  { skill: "Aptitude", value: 70 },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const ACTIVE_DAYS = [true, true, false, true, true, false, false];

const ASSESSMENTS = [
  { title: "DSA Mock Test", when: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", when: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", when: "Friday, 11:00 AM" },
];

function CircularProgress({ value, max = 100, size = 160 }: { value: number; max?: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="hsl(var(--primary))" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-3xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">Readiness Score</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const latest = getLatestEntry();
  const score = latest?.finalScore ?? 72;

  return (
    <div>
      <h1 className="mb-2 text-2xl">Dashboard</h1>
      <p className="mb-10 text-muted-foreground">Your placement readiness at a glance.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Readiness Score */}
        <Card>
          <CardHeader><CardTitle>Overall Readiness</CardTitle></CardHeader>
          <CardContent className="flex justify-center py-4">
            <CircularProgress value={score} />
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader><CardTitle>Skill Breakdown</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={DEFAULT_RADAR}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader><CardTitle>Continue Practice</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-1 font-semibold">Dynamic Programming</p>
            <p className="mb-3 text-sm text-muted-foreground">3 / 10 completed</p>
            <div className="mb-4 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: "30%" }} />
            </div>
            <button
              onClick={() => navigate("/practice")}
              className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-default hover:bg-primary/5"
            >
              Continue
            </button>
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader><CardTitle>Weekly Goals</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-1 text-sm">Problems Solved: <span className="font-semibold">12 / 20</span> this week</p>
            <div className="mb-4 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-success" style={{ width: "60%" }} />
            </div>
            <div className="flex gap-2">
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    ACTIVE_DAYS[i]
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Upcoming Assessments</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {ASSESSMENTS.map((a) => (
                <li key={a.title} className="flex items-center justify-between py-3">
                  <span className="font-medium">{a.title}</span>
                  <span className="text-sm text-muted-foreground">{a.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
