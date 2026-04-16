import { useState } from "react";
import { useAppContext, Organization } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Building2, Users, Shield } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Organizations() {
  const { organizations, addOrganization, updateOrganization, deleteOrganization } = useAppContext();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<Organization | null>(null);
  const [form, setForm] = useState({
    name: "", address: "", phone: "", email: "",
    type: "School" as "School" | "College" | "Institute",
    status: "Active" as "Active" | "Inactive",
    studentCount: 0, staffCount: 0,
  });

  const filtered = organizations.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => setForm({ name: "", address: "", phone: "", email: "", type: "School", status: "Active", studentCount: 0, staffCount: 0 });

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    const defaultPerms = {
      superadmin: ["all"] as string[],
      principal: ["dashboard", "students", "attendance", "timetable", "exams", "fees", "hostel", "transport", "circulars", "calendar", "events", "learning", "settings"],
      staff: ["dashboard", "students", "attendance", "timetable", "exams", "circulars", "calendar", "events", "learning"],
      student: ["dashboard", "attendance", "timetable", "exams", "fees", "hostel", "transport", "circulars", "calendar", "events", "learning"],
    };
    if (editOrg) {
      updateOrganization(editOrg.id, form);
      toast.success("Organization updated");
    } else {
      addOrganization({ ...form, permissions: defaultPerms, logo: undefined });
      toast.success("Organization created");
    }
    setDialogOpen(false);
    setEditOrg(null);
    resetForm();
  };

  const handleEdit = (org: Organization) => {
    setEditOrg(org);
    setForm({ name: org.name, address: org.address, phone: org.phone, email: org.email, type: org.type, status: org.status, studentCount: org.studentCount, staffCount: org.staffCount });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteOrganization(id);
    toast.success("Organization deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage schools, colleges, and institutes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditOrg(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add Organization</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editOrg ? "Edit" : "Create"} Organization</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label>Organization Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Delhi Public School" /></div>
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="School">School</SelectItem><SelectItem value="College">College</SelectItem><SelectItem value="Institute">Institute</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="col-span-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@school.edu" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <Button onClick={handleSave} className="mt-4 w-full gradient-primary border-0 rounded-xl">{editOrg ? "Update" : "Create"} Organization</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Organizations", value: organizations.length, icon: Building2, gradient: "from-purple-500 to-indigo-600" },
          { label: "Total Students", value: organizations.reduce((a, o) => a + o.studentCount, 0).toLocaleString(), icon: Users, gradient: "from-blue-500 to-indigo-600" },
          { label: "Active Orgs", value: organizations.filter((o) => o.status === "Active").length, icon: Shield, gradient: "from-emerald-500 to-teal-600" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", s.gradient)}>
                <s.icon className="h-5 w-5" />
              </div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-card border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2.5 flex-1 max-w-sm bg-muted/60 rounded-xl px-3.5 py-2 border border-transparent focus-within:border-primary/20">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search organizations..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-transparent h-auto p-0 shadow-none focus-visible:ring-0" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Organization</TableHead><TableHead>Type</TableHead><TableHead>Students</TableHead><TableHead>Staff</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((org) => (
                  <TableRow key={org.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm">{org.type}</span></TableCell>
                    <TableCell><span className="font-medium">{org.studentCount.toLocaleString()}</span></TableCell>
                    <TableCell><span className="font-medium">{org.staffCount}</span></TableCell>
                    <TableCell>
                      <span className={cn("text-xs px-2.5 py-1 rounded-lg font-medium", org.status === "Active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground")}>{org.status}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(org)} className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(org.id)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
