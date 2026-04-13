import { Search, Bell, Moon, Sun, User } from "lucide-react";
import { useAppContext, Role } from "@/contexts/AppContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { role, setRole, darkMode, toggleDarkMode, notifications, markNotificationRead, unreadCount, globalSearch, setGlobalSearch } = useAppContext();
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

  const roles: { value: Role; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
    { value: "student", label: "Student" },
  ];

  const roleColors: Record<Role, string> = {
    admin: "bg-primary text-primary-foreground",
    staff: "bg-accent text-accent-foreground",
    student: "bg-warning text-warning-foreground",
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search students, events, circulars..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
              <div className="p-3 border-b border-border font-semibold text-sm">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn("w-full text-left p-3 border-b border-border last:border-0 hover:bg-muted transition-colors", !n.read && "bg-primary/5")}
                  >
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      <span className="text-sm font-medium">{n.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={roleRef} className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors", roleColors[role])}
          >
            <User className="h-3.5 w-3.5" />
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
          {showRoleMenu && (
            <div className="absolute right-0 top-10 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => { setRole(r.value); setShowRoleMenu(false); }}
                  className={cn("w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors", role === r.value && "bg-muted font-semibold")}
                >
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
