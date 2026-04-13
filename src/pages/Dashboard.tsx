import { useAppContext } from "@/contexts/AppContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardCheck, DollarSign, Calendar, TrendingUp, BookOpen, Bell, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const { role } = useAppContext();
  const { students, attendance, fees, events, calendarEvents } = useData();

  const totalStudents = students.length;
  const totalPresent = attendance.filter((a) => a.status === "present").length;
  const totalRecords = attendance.length;
  const attendancePct = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
  const pendingFees = fees.filter((f) => f.status === "Pending").length;
  const upcomingEvents = calendarEvents.filter((e) => e.date >= "2026-04-13").length;

  const feeData = [
    { name: "Paid", value: fees.filter((f) => f.status === "Paid").length },
    { name: "Pending", value: pendingFees },
  ];
  const pieColors = ["hsl(160,60%,45%)", "hsl(38,92%,50%)"];

  const classDistribution = ["8", "9", "10", "11", "12"].map((c) => ({
    class: `Class ${c}`,
    students: students.filter((s) => s.class === c).length,
  }));

  const statCards = [
    { label: "Total Students", value: totalStudents, icon: Users, color: "text-primary" },
    { label: "Attendance %", value: `${attendancePct}%`, icon: ClipboardCheck, color: "text-accent" },
    { label: "Pending Fees", value: pendingFees, icon: DollarSign, color: "text-warning" },
    { label: "Upcoming Events", value: upcomingEvents, icon: Calendar, color: "text-info" },
  ];

  if (role === "student") {
    const myId = students[0]?.id;
    const myAttendance = attendance.filter((a) => a.studentId === myId);
    const myPresent = myAttendance.filter((a) => a.status === "present").length;
    const myPct = myAttendance.length > 0 ? Math.round((myPresent / myAttendance.length) * 100) : 0;
    const myFees = fees.filter((f) => f.studentId === myId);
    const myPending = myFees.filter((f) => f.status === "Pending");
    const myEvents = events.filter((e) => e.registeredStudents.includes(myId || ""));

    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Welcome, {students[0]?.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Attendance" value={`${myPct}%`} icon={ClipboardCheck} color="text-accent" />
          <StatCard label="Pending Fees" value={myPending.length} icon={DollarSign} color="text-warning" />
          <StatCard label="Registered Events" value={myEvents.length} icon={Calendar} color="text-info" />
          <StatCard label="Class" value={`${students[0]?.class}-${students[0]?.section}`} icon={BookOpen} color="text-primary" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {calendarEvents.filter((e) => e.date >= "2026-04-13").slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${e.type === "Holiday" ? "bg-accent" : e.type === "Exam" ? "bg-destructive" : "bg-info"}`} />
                    <span className="text-sm">{e.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Fee Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {myFees.map((f) => (
                <div key={f.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{f.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">₹{f.amount.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.status === "Paid" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"}`}>
                      {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">{role === "admin" ? "Admin" : "Staff"} Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Students by Class</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="class" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Fee Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={feeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {feeData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {role === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Recent Circulars</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[...Array(3)].map((_, i) => {
                const c = ["Mid-Term Exam Schedule", "Annual Day Celebration", "Updated Dress Code"][i];
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm">{c}</span>
                    <span className="text-xs text-muted-foreground">Apr {12 - i}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Quick Stats</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-primary">{events.length}</p>
                <p className="text-xs text-muted-foreground">Active Events</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-accent">6</p>
                <p className="text-xs text-muted-foreground">Teachers</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-warning">12</p>
                <p className="text-xs text-muted-foreground">Hostel Rooms</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-info">3</p>
                <p className="text-xs text-muted-foreground">Bus Routes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`p-3 rounded-lg bg-muted ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
