import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockExams, mockExamResults, getGrade } from "@/data/mockData";
import { useAppContext } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";

export default function Exams() {
  const { students } = useData();
  const { role } = useAppContext();
  const [selectedExam, setSelectedExam] = useState(mockExams[0]?.id || "");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const exam = mockExams.find((e) => e.id === selectedExam);
  const examStudents = students.filter((s) => s.class === exam?.class);

  const results = useMemo(() => {
    if (!exam) return [];
    return mockExamResults.filter((r) => r.examId === exam.id);
  }, [exam]);

  const studentResults = useMemo(() => {
    const map: Record<string, { subjects: { subject: string; marks: number; maxMarks: number }[]; total: number; maxTotal: number }> = {};
    results.forEach((r) => {
      if (!map[r.studentId]) map[r.studentId] = { subjects: [], total: 0, maxTotal: 0 };
      map[r.studentId].subjects.push({ subject: r.subject, marks: r.marks, maxMarks: r.maxMarks });
      map[r.studentId].total += r.marks;
      map[r.studentId].maxTotal += r.maxMarks;
    });
    return map;
  }, [results]);

  const reportCard = selectedStudentId ? studentResults[selectedStudentId] : null;
  const reportStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Exams & Grades</h1>

      <div className="flex flex-wrap gap-3">
        <Select value={selectedExam} onValueChange={(v) => { setSelectedExam(v); setSelectedStudentId(""); }}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Select Exam" /></SelectTrigger>
          <SelectContent>{mockExams.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} ({e.class})</SelectItem>)}</SelectContent>
        </Select>
        <Badge variant="outline">{exam?.type}</Badge>
        <Badge variant="outline">{exam?.date}</Badge>
      </div>

      {exam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Results - {exam.name}</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      {exam.subjects.map((s) => <TableHead key={s} className="text-center">{s.slice(0, 4)}</TableHead>)}
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">%</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examStudents.map((s) => {
                      const sr = studentResults[s.id];
                      if (!sr) return null;
                      const pct = Math.round((sr.total / sr.maxTotal) * 100);
                      return (
                        <TableRow key={s.id} className="cursor-pointer hover:bg-muted" onClick={() => setSelectedStudentId(s.id)}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          {exam.subjects.map((sub) => {
                            const subR = sr.subjects.find((x) => x.subject === sub);
                            return <TableCell key={sub} className="text-center">{subR?.marks || "-"}</TableCell>;
                          })}
                          <TableCell className="text-center font-medium">{sr.total}/{sr.maxTotal}</TableCell>
                          <TableCell className="text-center">{pct}%</TableCell>
                          <TableCell className="text-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pct >= 80 ? "bg-accent/10 text-accent" : pct >= 60 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                              {getGrade(pct)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Report Card</CardTitle></CardHeader>
            <CardContent>
              {reportCard && reportStudent ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="font-bold text-lg">{reportStudent.name}</p>
                    <p className="text-sm text-muted-foreground">Class {reportStudent.class}-{reportStudent.section} | Roll: {reportStudent.rollNo}</p>
                  </div>
                  <div className="space-y-2">
                    {reportCard.subjects.map((s) => (
                      <div key={s.subject} className="flex justify-between items-center py-1.5 border-b border-border">
                        <span className="text-sm">{s.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{s.marks}/{s.maxMarks}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${s.marks >= 80 ? "bg-accent/10 text-accent" : s.marks >= 60 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                            {getGrade(s.marks)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Overall</p>
                    <p className="text-2xl font-bold">{Math.round((reportCard.total / reportCard.maxTotal) * 100)}%</p>
                    <p className="text-lg font-semibold text-primary">{getGrade(Math.round((reportCard.total / reportCard.maxTotal) * 100))}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click a student row to view report card</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
