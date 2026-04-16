import { Search, Bell, Moon, Sun, User, ChevronDown } from "lucide-react";
import { useAppContext, Role } from "@/contexts/AppContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const roleLabels: Record<Role, string> = {
  superadmin: "Super Admin",
  principal: "Principal",
  staff: "Staff",
  student: "Student",
};

const roleGradients: Record<Role, string> = {
  superadmin: "from-purple-500 to-indigo-600",
  principal: "from-blue-500 to-indigo-600",
  staff: "from-emerald-500 to-teal-600",
  student: "from-amber-500 to-orange-600",
};

export function TopBar() {
  const { role, setRole, darkMode, toggleDarkMode, notifications, markNotificationRead, unreadCount, globalSearch, setGlobalSearch, currentOrg, login } = useAppContext();
  const [showNotif, setShowNotif] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoleMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchableRoles: { value: Role; label: string }[] = [
    { value: "superadmin", label: "Super Admin" },
    { value: "principal", label: "Principal" },
    { value: "staff", label: "Staff" },
    { value: "student", label: "Student" },
  ];

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="flex items-center gap-2.5 flex-1 bg-muted/60 rounded-xl px-3.5 py-2 border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-all">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search students, events, circulars..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode */}
        <button onClick={toggleDarkMode} className="p-2.5 rounded-xl hover:bg-muted transition-all text-muted-foreground">
          {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="p-2.5 rounded-xl hover:bg-muted transition-all text-muted-foreground relative">
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-card">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-border">
                <p className="font-semibold text-sm">Notifications</p>
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn("w-full text-left p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors", !n.read && "bg-primary/5")}
                  >
                    <div className="flex items-center gap-2.5">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      <span className="text-sm font-medium">{n.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-4">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5 ml-4">{n.date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border mx-1" />

        {/* Role switcher */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted transition-all"
          >
            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white", roleGradients[role])}>
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none">{roleLabels[role]}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{currentOrg?.name || "Platform"}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>
          {showRoleMenu && (
            <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-elevated overflow-hidden animate-fade-in">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-3 pt-3 pb-1">Switch Role</p>
              {switchableRoles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { login(r.value); setShowRoleMenu(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2.5",
                    role === r.value && "bg-muted font-semibold"
                  )}
                >
                  <div className={cn("w-6 h-6 rounded-md bg-gradient-to-br flex items-center justify-center text-white text-[10px]", roleGradients[r.value])}>
                    {r.label[0]}
                  </div>
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
