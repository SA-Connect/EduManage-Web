import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Student, AttendanceRecord, FeeRecord, Circular, CalendarEvent, SchoolEvent, LearningMaterial,
  mockStudents, mockFees, mockCirculars, mockCalendarEvents, mockEvents, mockLearningMaterials, generateAttendance,
} from "@/data/mockData";

interface DataContextType {
  students: Student[];
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  attendance: AttendanceRecord[];
  markAttendance: (studentId: string, date: string, status: "present" | "absent") => void;
  fees: FeeRecord[];
  payFee: (feeId: string) => void;
  circulars: Circular[];
  addCircular: (c: Omit<Circular, "id">) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (e: Omit<CalendarEvent, "id">) => void;
  events: SchoolEvent[];
  registerForEvent: (eventId: string, studentId: string) => void;
  unregisterFromEvent: (eventId: string, studentId: string) => void;
  learningMaterials: LearningMaterial[];
  addLearningMaterial: (m: Omit<LearningMaterial, "id">) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(generateAttendance);
  const [fees, setFees] = useState<FeeRecord[]>(mockFees);
  const [circulars, setCirculars] = useState<Circular[]>(mockCirculars);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [events, setEvents] = useState<SchoolEvent[]>(mockEvents);
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>(mockLearningMaterials);

  const addStudent = useCallback((s: Omit<Student, "id">) => {
    setStudents((prev) => [...prev, { ...s, id: `STU${String(prev.length + 1).padStart(3, "0")}` }]);
  }, []);

  const updateStudent = useCallback((id: string, s: Partial<Student>) => {
    setStudents((prev) => prev.map((st) => (st.id === id ? { ...st, ...s } : st)));
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const markAttendance = useCallback((studentId: string, date: string, status: "present" | "absent") => {
    setAttendance((prev) => {
      const existing = prev.findIndex((a) => a.studentId === studentId && a.date === date);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = { studentId, date, status };
        return copy;
      }
      return [...prev, { studentId, date, status }];
    });
  }, []);

  const payFee = useCallback((feeId: string) => {
    setFees((prev) =>
      prev.map((f) => (f.id === feeId ? { ...f, status: "Paid" as const, paidDate: new Date().toISOString().slice(0, 10) } : f))
    );
  }, []);

  const addCircular = useCallback((c: Omit<Circular, "id">) => {
    setCirculars((prev) => [{ ...c, id: `C${prev.length + 1}` }, ...prev]);
  }, []);

  const addCalendarEvent = useCallback((e: Omit<CalendarEvent, "id">) => {
    setCalendarEvents((prev) => [...prev, { ...e, id: `CE${prev.length + 1}` }]);
  }, []);

  const registerForEvent = useCallback((eventId: string, studentId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId && !e.registeredStudents.includes(studentId)
          ? { ...e, registeredStudents: [...e.registeredStudents, studentId] }
          : e
      )
    );
  }, []);

  const unregisterFromEvent = useCallback((eventId: string, studentId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registeredStudents: e.registeredStudents.filter((id) => id !== studentId) } : e
      )
    );
  }, []);

  const addLearningMaterial = useCallback((m: Omit<LearningMaterial, "id">) => {
    setLearningMaterials((prev) => [...prev, { ...m, id: `LM${prev.length + 1}` }]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        students, addStudent, updateStudent, deleteStudent,
        attendance, markAttendance,
        fees, payFee,
        circulars, addCircular,
        calendarEvents, addCalendarEvent,
        events, registerForEvent, unregisterFromEvent,
        learningMaterials, addLearningMaterial,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
