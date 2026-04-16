import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const allModules = [
  { key: "dashboard", label: "Dashboard", description: "View overview and analytics" },
  { key: "students", label: "Student Management", description: "CRUD operations on student records" },
  { key: "attendance", label: "Attendance", description: "Mark and view attendance" },
  { key: "timetable", label: "Timetable", description: "View and manage class schedules" },
  { key: "exams", label: "Exams & Grades", description: "Manage exams and view results" },
  { key: "fees", label: "Fee Management", description: "View and manage fee records" },
  { key: "hostel", label: "Hostel", description: "Room allocation and management" },
  { key: "transport", label: "Transport", description: "Route and bus management" },
  { key: "circulars", label: "Circulars", description: "Create and view announcements" },
  { key: "calendar", label: "Academic Calendar", description: "View and manage calendar events" },
  { key: "events", label: "Events", description: "Manage and register for events" },
  { key: "learning", label: "Learning Materials", description: "Upload and access study materials" },
  { key: "settings", label: "Settings", description: "Organization settings and configuration" },
];

const roleConfig = [
  { role: "principal", label: "Principal", icon: GraduationCap, gradient: "from-blue-500 to-indigo-600" },
  { role: "staff", label: "Staff", icon: Users, gradient: "from-emerald-500 to-teal-600" },
  { role: "student", label: "Student", icon: BookOpen, gradient: "from-amber-500 to-orange-600" },
] as const;

export default function Permissions() {
  const { organizations, updateOrganization } = useAppContext();
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || "");

  const org = organizations.find((o) => o.id === selectedOrgId);

  const togglePermission = (role: "principal" | "staff" | "student", module: string) => {
    if (!org) return;
    const current = org.permissions[role] || [];
    const updated = current.includes(module) ? current.filter((m) => m !== module) : [...current, module];
    updateOrganization(org.id, {
      permissions: { ...org.permissions, [role]: updated },
    });
    toast.success(`Permission updated for ${role}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Role Permissions</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure module access for each role per organization</p>
      </div>

      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Select organization" /></SelectTrigger>
          <SelectContent>
            {organizations.map((o) => (
              <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {org && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roleConfig.map((rc) => (
            <Card key={rc.role} className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", rc.gradient)}>
                    <rc.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{rc.label}</CardTitle>
                    <p className="text-xs text-muted-foreground">{(org.permissions[rc.role] || []).length} modules enabled</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                {allModules.map((mod) => {
                  const enabled = (org.permissions[rc.role] || []).includes(mod.key);
                  return (
                    <div key={mod.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{mod.label}</p>
                        <p className="text-[10px] text-muted-foreground">{mod.description}</p>
                      </div>
                      <Switch checked={enabled} onCheckedChange={() => togglePermission(rc.role, mod.key)} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
