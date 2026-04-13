import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTimetable } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = [1, 2, 3, 4, 5, 6, 7];
const periodTimes = ["8:00-8:45", "8:45-9:30", "9:30-10:15", "10:30-11:15", "11:15-12:00", "12:00-12:45", "1:30-2:15"];

export default function Timetable() {
  const { role } = useAppContext();
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");

  const slots = mockTimetable.filter((t) => t.class === selectedClass && t.section === selectedSection);

  const getSlot = (day: string, period: number) => slots.find((s) => s.day === day && s.period === period);

  const subjectColors: Record<string, string> = {
    Mathematics: "bg-primary/10 text-primary border-primary/20",
    Physics: "bg-info/10 text-info border-info/20",
    Chemistry: "bg-accent/10 text-accent border-accent/20",
    English: "bg-warning/10 text-warning border-warning/20",
    Hindi: "bg-destructive/10 text-destructive border-destructive/20",
    "Computer Science": "bg-secondary text-secondary-foreground border-border",
    Biology: "bg-accent/10 text-accent border-accent/20",
    History: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Timetable</h1>
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["8","9","10","11","12"].map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{["A","B","C"].map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Weekly Schedule - Class {selectedClass} Section {selectedSection}</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-muted-foreground font-medium border-b border-border">Day / Period</th>
                {periods.map((p) => (
                  <th key={p} className="p-2 text-center border-b border-border">
                    <div className="font-medium">P{p}</div>
                    <div className="text-[10px] text-muted-foreground">{periodTimes[p - 1]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className="p-2 font-medium border-b border-border">{day}</td>
                  {periods.map((p) => {
                    const slot = getSlot(day, p);
                    if (p === 4) return <td key={p} className="p-1 border-b border-border text-center"><span className="text-[10px] text-muted-foreground">Break</span></td>;
                    return (
                      <td key={p} className="p-1 border-b border-border">
                        {slot && (
                          <div className={cn("rounded-md border p-1.5 text-center", subjectColors[slot.subject] || "bg-muted")}>
                            <div className="font-medium text-xs">{slot.subject}</div>
                            {role !== "student" && <div className="text-[10px] opacity-70">{slot.teacher}</div>}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
