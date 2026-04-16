import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardCheck, Calendar, FileText, DollarSign,
  Building, Megaphone, CalendarDays, PartyPopper, BookOpen, Bus,
  ChevronLeft, ChevronRight, GraduationCap, Settings, Shield, Building2, LogOut,
} from "lucide-react";
import { useAppContext, Role } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  label: string;
  icon: any;
  path: string;
  roles: Role[];
}

const orgNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", roles: ["principal", "staff", "student"] },
  { label: "Students", icon: Users, path: "/students", roles: ["principal", "staff"] },
  { label: "Attendance", icon: ClipboardCheck, path: "/attendance", roles: ["principal", "staff", "student"] },
  { label: "Timetable", icon: Calendar, path: "/timetable", roles: ["principal", "staff", "student"] },
  { label: "Exams & Grades", icon: FileText, path: "/exams", roles: ["principal", "staff", "student"] },
  { label: "Fees", icon: DollarSign, path: "/fees", roles: ["principal", "student"] },
  { label: "Hostel", icon: Building, path: "/hostel", roles: ["principal", "student"] },
  { label: "Transport", icon: Bus, path: "/transport", roles: ["principal", "student"] },
  { label: "Circulars", icon: Megaphone, path: "/circulars", roles: ["principal", "staff", "student"] },
  { label: "Calendar", icon: CalendarDays, path: "/calendar", roles: ["principal", "staff", "student"] },
  { label: "Events", icon: PartyPopper, path: "/events", roles: ["principal", "staff", "student"] },
  { label: "Learning", icon: BookOpen, path: "/learning", roles: ["principal", "staff", "student"] },
];

const superAdminNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", roles: ["superadmin"] },
  { label: "Organizations", icon: Building2, path: "/admin/organizations", roles: ["superadmin"] },
  { label: "Permissions", icon: Shield, path: "/admin/permissions", roles: ["superadmin"] },
  { label: "Settings", icon: Settings, path: "/admin/settings", roles: ["superadmin"] },
];

export function AppSidebar() {
  const { role, logout, currentOrg } = useAppContext();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items = role === "superadmin" ? superAdminNavItems : orgNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-30",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/25">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-bold text-base text-sidebar-primary-foreground tracking-tight block">EduPortal</span>
            {role !== "superadmin" && currentOrg && (
              <span className="text-[10px] text-sidebar-foreground/60 truncate block">{currentOrg.name}</span>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/40 px-3 mb-2">
            {role === "superadmin" ? "Platform" : "Menu"}
          </p>
        )}
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-11 border-t border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
