import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Shield, Activity, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const { organizations } = useAppContext();

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter((o) => o.status === "Active").length;
  const totalStudents = organizations.reduce((a, o) => a + o.studentCount, 0);
  const totalStaff = organizations.reduce((a, o) => a + o.staffCount, 0);

  const orgData = organizations.map((o) => ({
    name: o.name.split(" ").slice(0, 2).join(" "),
    students: o.studentCount,
    staff: o.staffCount,
  }));

  const stats = [
    { label: "Organizations", value: totalOrgs, icon: Building2, gradient: "from-purple-500 to-indigo-600", change: `${activeOrgs} active` },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, gradient: "from-blue-500 to-indigo-600", change: "+8% this quarter" },
    { label: "Total Staff", value: totalStaff.toLocaleString(), icon: Shield, gradient: "from-emerald-500 to-teal-600", change: "+3% this quarter" },
    { label: "Platform Health", value: "99.9%", icon: Activity, gradient: "from-amber-500 to-orange-600", change: "Uptime" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage organizations and platform settings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card border-border/50 hover:shadow-elevated transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", s.gradient)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="h-3 w-3" />
                  {s.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader><CardTitle className="text-base font-semibold">Organization Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orgData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, boxShadow: "var(--shadow-elevated)", backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Students" />
                <Bar dataKey="staff" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} name="Staff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader><CardTitle className="text-base font-semibold">Recent Organizations</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {organizations.map((org) => (
              <div key={org.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.type} · {org.studentCount} students</p>
                  </div>
                </div>
                <span className={cn(
                  "text-xs px-2.5 py-1 rounded-lg font-medium",
                  org.status === "Active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                )}>
                  {org.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
