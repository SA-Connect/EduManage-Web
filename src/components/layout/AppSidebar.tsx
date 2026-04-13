import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardCheck, Calendar, FileText, DollarSign,
  Building, Megaphone, CalendarDays, PartyPopper, BookOpen, Bus,
  ChevronLeft, ChevronRight, GraduationCap,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

const allNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", roles: ["admin", "staff", "student"] },
  { label: "Students", icon: Users, path: "/students", roles: ["admin", "staff"] },
  { label: "Attendance", icon: ClipboardCheck, path: "/attendance", roles: ["admin", "staff", "student"] },
  { label: "Timetable", icon: Calendar, path: "/timetable", roles: ["admin", "staff", "student"] },
  { label: "Exams & Grades", icon: FileText, path: "/exams", roles: ["admin", "staff", "student"] },
  { label: "Fees", icon: DollarSign, path: "/fees", roles: ["admin", "student"] },
  { label: "Hostel", icon: Building, path: "/hostel", roles: ["admin", "student"] },
  { label: "Transport", icon: Bus, path: "/transport", roles: ["admin", "student"] },
  { label: "Circulars", icon: Megaphone, path: "/circulars", roles: ["admin", "staff", "student"] },
  { label: "Calendar", icon: CalendarDays, path: "/calendar", roles: ["admin", "staff", "student"] },
  { label: "Events", icon: PartyPopper, path: "/events", roles: ["admin", "staff", "student"] },
  { label: "Learning", icon: BookOpen, path: "/learning", roles: ["admin", "staff", "student"] },
];

export function AppSidebar() {
  const { role } = useAppContext();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        <GraduationCap className="h-7 w-7 text-sidebar-primary shrink-0" />
        {!collapsed && <span className="font-bold text-lg text-sidebar-primary-foreground tracking-tight">EduPortal</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
