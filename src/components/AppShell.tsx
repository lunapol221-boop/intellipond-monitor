import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Activity, Fish, Bell, Settings, Database, Users, FileText, LogOut, Waves, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

const userNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/behavior", label: "Behavior", icon: Activity },
  { to: "/dashboard/growth", label: "Growth", icon: Fish },
  { to: "/dashboard/alerts", label: "Alerts", icon: Bell },
];

const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/sensors", label: "Sensors", icon: Database },
  { to: "/admin/ponds", label: "Ponds", icon: Waves },
  { to: "/admin/growth", label: "Growth Records", icon: Fish },
  { to: "/admin/alerts", label: "Alert History", icon: Bell },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Sliders },
];

export const AppShell = ({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) => {
  const { signOut, user, role } = useAuth();
  const nav = useNavigate();
  const items = admin ? adminNav : userNav;

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-secondary/30">
      <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <Link to="/" className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl gradient-aqua grid place-items-center shadow-glow">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold tracking-tight text-sidebar-primary-foreground">IntelliPond</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">{admin ? "Admin Console" : "Operator"}</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-soft" : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
              )}>
              <Icon className="h-4 w-4" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {role === "admin" && !admin && (
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => nav("/admin")}>
              <Settings className="h-4 w-4 mr-2" /> Switch to Admin
            </Button>
          )}
          {admin && (
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => nav("/dashboard")}>
              <LayoutDashboard className="h-4 w-4 mr-2" /> Operator View
            </Button>
          )}
          <div className="px-2 py-1.5 text-xs text-sidebar-foreground/60 truncate">{user?.email}</div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={async () => { await signOut(); nav("/"); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/" className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg gradient-aqua grid place-items-center"><Waves className="h-4 w-4 text-white" /></div><span className="font-semibold">IntelliPond</span></Link>
          <Button size="sm" variant="ghost" onClick={async () => { await signOut(); nav("/"); }}><LogOut className="h-4 w-4" /></Button>
        </div>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
