import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Attendance() {
  const { students, attendance, markAttendance } = useData();
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedDate, setSelectedDate] = useState("2026-04-13");
  const [viewMode, setViewMode] = useState<"mark" | "history">("mark");
  const [historyStudentId, setHistoryStudentId] = useState("");

  const classStudents = students.filter((s) => s.class === selectedClass && s.section === selectedSection);

  const todayAttendance = useMemo(() => {
    const map: Record<string, "present" | "absent"> = {};
    attendance.filter((a) => a.date === selectedDate).forEach((a) => { map[a.studentId] = a.status; });
    return map;
  }, [attendance, selectedDate]);

  const handleMark = (studentId: string, status: "present" | "absent") => {
    markAttendance(studentId, selectedDate, status);
    toast.success(`Marked ${status}`);
  };

  const markAll = (status: "present" | "absent") => {
    classStudents.forEach((s) => markAttendance(s.id, selectedDate, status));
    toast.success(`All marked ${status}`);
  };

  // History for selected student
  const studentHistory = useMemo(() => {
    if (!historyStudentId) return [];
    return attendance.filter((a) => a.studentId === historyStudentId).sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, historyStudentId]);

  const studentPct = useMemo(() => {
    if (!historyStudentId) return 0;
    const recs = attendance.filter((a) => a.studentId === historyStudentId);
    if (recs.length === 0) return 0;
    return Math.round((recs.filter((r) => r.status === "present").length / recs.length) * 100);
  }, [attendance, historyStudentId]);

  // Weekly trend chart
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date("2026-04-13");
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const dayRecs = attendance.filter((a) => a.date === ds && classStudents.some((s) => s.id === a.studentId));
      const present = dayRecs.filter((a) => a.status === "present").length;
      days.push({ day: ds.slice(5), present, absent: dayRecs.length - present });
    }
    return days;
  }, [attendance, classStudents]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === "mark" ? "default" : "outline"} size="sm" onClick={() => setViewMode("mark")}>Mark Attendance</Button>
          <Button variant={viewMode === "history" ? "default" : "outline"} size="sm" onClick={() => setViewMode("history")}>History</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{["8","9","10","11","12"].map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{["A","B","C"].map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44" />
      </div>

      {viewMode === "mark" ? (
        <>
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Class {selectedClass}-{selectedSection} | {selectedDate}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => markAll("present")} className="text-accent"><Check className="h-4 w-4 mr-1" /> All Present</Button>
                <Button variant="outline" size="sm" onClick={() => markAll("absent")} className="text-destructive"><X className="h-4 w-4 mr-1" /> All Absent</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.rollNo}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        {todayAttendance[s.id] ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${todayAttendance[s.id] === "present" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                            {todayAttendance[s.id]}
                          </span>
                        ) : <span className="text-xs text-muted-foreground">Not marked</span>}
                      </TableCell>
                      <TableCell className="space-x-1">
                        <Button size="sm" variant={todayAttendance[s.id] === "present" ? "default" : "outline"} onClick={() => handleMark(s.id, "present")} className="h-7 text-xs">P</Button>
                        <Button size="sm" variant={todayAttendance[s.id] === "absent" ? "destructive" : "outline"} onClick={() => handleMark(s.id, "absent")} className="h-7 text-xs">A</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Weekly Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="present" fill="hsl(var(--accent))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Attendance History</CardTitle>
            <Select value={historyStudentId} onValueChange={setHistoryStudentId}>
              <SelectTrigger className="w-60 mt-2"><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{classStudents.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.rollNo})</SelectItem>)}</SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {historyStudentId ? (
              <>
                <div className="mb-4 flex items-center gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-accent">{studentPct}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{studentHistory.filter((a) => a.status === "present").length}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-destructive">{studentHistory.filter((a) => a.status === "absent").length}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                </div>
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {studentHistory.slice(0, 20).map((a, i) => (
                      <TableRow key={i}>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === "present" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                            {a.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : <p className="text-muted-foreground text-sm">Select a student to view history</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
