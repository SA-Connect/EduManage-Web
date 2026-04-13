import React, { createContext, useContext, useState, useCallback } from "react";

export type Role = "admin" | "staff" | "student";

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
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  read: boolean;
  date: string;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultNotifications: Notification[] = [
  { id: "1", title: "Fee Reminder", message: "Term fees due by April 30th", type: "warning", read: false, date: "2026-04-13" },
  { id: "2", title: "Exam Schedule", message: "Mid-term exams start May 5th", type: "info", read: false, date: "2026-04-12" },
  { id: "3", title: "Holiday", message: "School closed on April 18th", type: "info", read: true, date: "2026-04-10" },
  { id: "4", title: "New Circular", message: "Updated dress code policy", type: "info", read: false, date: "2026-04-11" },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [globalSearch, setGlobalSearch] = useState("");

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{ role, setRole, darkMode, toggleDarkMode, notifications, addNotification, markNotificationRead, unreadCount, globalSearch, setGlobalSearch }}
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
