import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  History,
  BookOpen,
  ClipboardCheck,
  User,
  Rocket,
  ShieldCheck,
  Award,
} from "lucide-react";
import TopBar from "./TopBar";
import ProofFooter from "./ProofFooter";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/practice", icon: BookOpen, label: "Practice" },
  { to: "/assessments", icon: ClipboardCheck, label: "Assessments" },
  { to: "/resources", icon: FileText, label: "Resources" },
  { to: "/history", icon: History, label: "History" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BUILD_NAV = [
  { to: "/prp/07-test", icon: ShieldCheck, label: "Test Checklist" },
  { to: "/prp/08-ship", icon: Rocket, label: "Ship" },
  { to: "/prp/proof", icon: Award, label: "Proof" },
];

function SidebarLink({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-default ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function AppShell() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar p-4 md:flex md:flex-col md:justify-between overflow-y-auto">
          <div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <SidebarLink key={n.to} {...n} />
              ))}
            </nav>
            <div className="my-4 h-px bg-border" />
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Build
            </p>
            <nav className="flex flex-col gap-1">
              {BUILD_NAV.map((n) => (
                <SidebarLink key={n.to} {...n} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-10">
            <Outlet />
          </div>
        </main>
      </div>
      <ProofFooter />
    </div>
  );
}
