import React, { createContext, useContext, useState, useCallback } from "react";

export type Role = "superadmin" | "principal" | "staff" | "student";

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  type: "School" | "College" | "Institute";
  status: "Active" | "Inactive";
  createdAt: string;
  studentCount: number;
  staffCount: number;
  permissions: Record<Role, string[]>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  read: boolean;
  date: string;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "read" | "date">) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  isLoggedIn: boolean;
  login: (role: Role) => void;
  logout: () => void;
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
  organizations: Organization[];
  addOrganization: (org: Omit<Organization, "id" | "createdAt">) => void;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultPermissions: Record<Role, string[]> = {
  superadmin: ["all"],
  principal: ["dashboard", "students", "attendance", "timetable", "exams", "fees", "hostel", "transport", "circulars", "calendar", "events", "learning", "settings"],
  staff: ["dashboard", "students", "attendance", "timetable", "exams", "circulars", "calendar", "events", "learning"],
  student: ["dashboard", "attendance", "timetable", "exams", "fees", "hostel", "transport", "circulars", "calendar", "events", "learning"],
};

const defaultOrganizations: Organization[] = [
  {
    id: "ORG001",
    name: "Delhi Public School",
    address: "Sector 24, Mathura Road, New Delhi",
    phone: "+91 11-26844150",
    email: "info@dps.edu.in",
    type: "School",
    status: "Active",
    createdAt: "2025-01-15",
    studentCount: 1247,
    staffCount: 86,
    permissions: defaultPermissions,
  },
  {
    id: "ORG002",
    name: "St. Xavier's College",
    address: "5, Mahapalika Marg, Mumbai",
    phone: "+91 22-22620661",
    email: "admin@xaviers.edu",
    type: "College",
    status: "Active",
    createdAt: "2025-03-20",
    studentCount: 3450,
    staffCount: 210,
    permissions: defaultPermissions,
  },
  {
    id: "ORG003",
    name: "Kendriya Vidyalaya",
    address: "Sector 12, Chandigarh",
    phone: "+91 172-2747462",
    email: "kv12@kvs.gov.in",
    type: "School",
    status: "Inactive",
    createdAt: "2025-06-10",
    studentCount: 890,
    staffCount: 52,
    permissions: defaultPermissions,
  },
];

const defaultNotifications: Notification[] = [
  { id: "1", title: "Fee Reminder", message: "Term fees due by April 30th", type: "warning", read: false, date: "2026-04-13" },
  { id: "2", title: "Exam Schedule", message: "Mid-term exams start May 5th", type: "info", read: false, date: "2026-04-12" },
  { id: "3", title: "Holiday", message: "School closed on April 18th", type: "info", read: true, date: "2026-04-10" },
  { id: "4", title: "New Circular", message: "Updated dress code policy", type: "info", read: false, date: "2026-04-11" },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("principal");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(defaultOrganizations[0]);
  const [organizations, setOrganizations] = useState<Organization[]>(defaultOrganizations);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "date">) => {
    setNotifications((prev) => [
      { ...n, id: Date.now().toString(), read: false, date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const login = useCallback((r: Role) => {
    setRole(r);
    setIsLoggedIn(true);
    if (r === "superadmin") setCurrentOrg(null);
    else if (!currentOrg) setCurrentOrg(defaultOrganizations[0]);
  }, [currentOrg]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole("principal");
  }, []);

  const addOrganization = useCallback((org: Omit<Organization, "id" | "createdAt">) => {
    setOrganizations((prev) => [
      ...prev,
      { ...org, id: `ORG${String(prev.length + 1).padStart(3, "0")}`, createdAt: new Date().toISOString().slice(0, 10) },
    ]);
  }, []);

  const updateOrganization = useCallback((id: string, updates: Partial<Organization>) => {
    setOrganizations((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  }, []);

  const deleteOrganization = useCallback((id: string) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role, setRole, darkMode, toggleDarkMode,
        notifications, addNotification, markNotificationRead, unreadCount,
        globalSearch, setGlobalSearch,
        isLoggedIn, login, logout,
        currentOrg, setCurrentOrg,
        organizations, addOrganization, updateOrganization, deleteOrganization,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
