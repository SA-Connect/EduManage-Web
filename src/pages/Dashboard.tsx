import { useAppContext } from "@/contexts/AppContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardCheck, DollarSign, Calendar, TrendingUp, BookOpen, Bell, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { role } = useAppContext();
  const { students, attendance, fees, events, calendarEvents } = useData();

  const totalStudents = students.length;
  const totalPresent = attendance.filter((a) => a.status === "present").length;
  const totalRecords = attendance.length;
  const attendancePct = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;
  const pendingFees = fees.filter((f) => f.status === "Pending").length;
  const pendingAmount = fees.filter((f) => f.status === "Pending").reduce((a, f) => a + f.amount, 0);
  const upcomingEvents = calendarEvents.filter((e) => e.date >= "2026-04-13").length;

  const feeData = [
    { name: "Collected", value: fees.filter((f) => f.status === "Paid").length },
    { name: "Pending", value: pendingFees },
  ];
  const pieColors = ["hsl(152,60%,42%)", "hsl(38,92%,50%)"];

  const classDistribution = ["8", "9", "10", "11", "12"].map((c) => ({
    class: `Class ${c}`,
    students: students.filter((s) => s.class === c).length,
  }));

  // Mock weekly attendance trend
  const weeklyTrend = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    rate: [92, 94, 91, 96, 93, 88, 0][i],
  })).filter((d) => d.rate > 0);

  const statCards = [
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, change: "+12%", positive: true, gradient: "from-blue-500 to-indigo-600" },
    { label: "Attendance Rate", value: `${attendancePct}%`, icon: ClipboardCheck, change: "+2.1%", positive: true, gradient: "from-emerald-500 to-teal-600" },
    { label: "Pending Fees", value: `₹${(pendingAmount / 100000).toFixed(1)}L`, icon: DollarSign, change: `${pendingFees} students`, positive: false, gradient: "from-amber-500 to-orange-600" },
    { label: "Upcoming Events", value: upcomingEvents.toString(), icon: Calendar, change: "3 this week", positive: true, gradient: "from-purple-500 to-pink-600" },
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
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {students[0]?.name} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your academic overview</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="My Attendance" value={`${myPct}%`} icon={ClipboardCheck} change="+2%" positive={true} gradient="from-emerald-500 to-teal-600" />
          <StatCard label="Pending Fees" value={myPending.length.toString()} icon={DollarSign} change={`₹${myPending.reduce((a, f) => a + f.amount, 0).toLocaleString()}`} positive={false} gradient="from-amber-500 to-orange-600" />
          <StatCard label="Events Joined" value={myEvents.length.toString()} icon={Calendar} change="2 upcoming" positive={true} gradient="from-purple-500 to-pink-600" />
          <StatCard label="Class" value={`${students[0]?.class}-${students[0]?.section}`} icon={BookOpen} change={`Roll: ${students[0]?.rollNo}`} positive={true} gradient="from-blue-500 to-indigo-600" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card border-border/50">
            <CardHeader><CardTitle className="text-base font-semibold">Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {calendarEvents.filter((e) => e.date >= "2026-04-13").slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-2.5 w-2.5 rounded-full", e.type === "Holiday" ? "bg-accent" : e.type === "Exam" ? "bg-destructive" : "bg-info")} />
                    <span className="text-sm font-medium">{e.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{e.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-card border-border/50">
            <CardHeader><CardTitle className="text-base font-semibold">Fee Summary</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {myFees.map((f) => (
                <div key={f.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium">{f.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">₹{f.amount.toLocaleString()}</span>
                    <span className={cn("text-xs px-2.5 py-1 rounded-lg font-medium", f.status === "Paid" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning")}>
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
      <div>
        <h1 className="text-2xl font-bold">{role === "principal" ? "Principal" : "Staff"} Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your school overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-border/50">
          <CardHeader><CardTitle className="text-base font-semibold">Students by Class</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={classDistribution} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="class" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, boxShadow: "var(--shadow-elevated)" }} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader><CardTitle className="text-base font-semibold">Fee Collection</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={feeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" strokeWidth={0}>
                  {feeData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, boxShadow: "var(--shadow-elevated)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-2">
              {feeData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-xs text-muted-foreground">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader><CardTitle className="text-base font-semibold">Weekly Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, boxShadow: "var(--shadow-elevated)", backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" fill="url(#attendanceGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {role === "principal" && (
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { text: "Mid-Term Exam Schedule published", time: "2 hours ago", type: "info" },
                { text: "Fee payment received from Aarav Sharma", time: "4 hours ago", type: "success" },
                { text: "New student enrolled — Pallavi Hegde", time: "Yesterday", type: "info" },
                { text: "Annual Day event registrations open", time: "Yesterday", type: "warning" },
                { text: "Transport Route 2 updated", time: "2 days ago", type: "info" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                    item.type === "success" ? "bg-accent" : item.type === "warning" ? "bg-warning" : "bg-info"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {role === "staff" && (
          <Card className="shadow-card border-border/50">
            <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Quick Stats</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                { label: "Active Events", value: events.length, color: "text-primary" },
                { label: "Teachers", value: "6", color: "text-accent" },
                { label: "Hostel Rooms", value: "12", color: "text-warning" },
                { label: "Bus Routes", value: "3", color: "text-info" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl bg-muted/50 border border-border/50">
                  <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, change, positive, gradient }: {
  label: string; value: string | number; icon: any; change: string; positive: boolean; gradient: string;
}) {
  return (
    <Card className="shadow-card border-border/50 hover:shadow-elevated transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", gradient)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg", positive ? "text-accent bg-accent/10" : "text-warning bg-warning/10")}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {change}
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
