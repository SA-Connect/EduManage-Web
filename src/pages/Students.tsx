import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { Student } from "@/data/mockData";

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "all" || s.class === filterClass;
    const matchSection = filterSection === "all" || s.section === filterSection;
    return matchSearch && matchClass && matchSection;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const [form, setForm] = useState({ name: "", class: "10", section: "A", rollNo: "", parentContact: "", email: "", gender: "Male" as "Male" | "Female", dob: "", address: "" });

  const resetForm = () => setForm({ name: "", class: "10", section: "A", rollNo: "", parentContact: "", email: "", gender: "Male", dob: "", address: "" });

  const handleSave = () => {
    if (!form.name || !form.rollNo) { toast.error("Name and Roll No are required"); return; }
    if (editStudent) {
      updateStudent(editStudent.id, { ...form, rollNo: parseInt(form.rollNo) });
      toast.success("Student updated");
    } else {
      addStudent({ ...form, rollNo: parseInt(form.rollNo) });
      toast.success("Student added");
    }
    setDialogOpen(false);
    setEditStudent(null);
    resetForm();
  };

  const handleEdit = (s: Student) => {
    setEditStudent(s);
    setForm({ name: s.name, class: s.class, section: s.section, rollNo: String(s.rollNo), parentContact: s.parentContact, email: s.email, gender: s.gender, dob: s.dob, address: s.address });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    toast.success("Student deleted");
  };

  const exportCSV = () => {
    const header = "ID,Name,Class,Section,Roll No,Email,Parent Contact\n";
    const rows = filtered.map((s) => `${s.id},${s.name},${s.class},${s.section},${s.rollNo},${s.email},${s.parentContact}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    toast.success("CSV exported");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditStudent(null); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Student</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editStudent ? "Edit" : "Add"} Student</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Class</Label>
                  <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["8","9","10","11","12"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Section</Label>
                  <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["A","B","C"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Roll No</Label><Input value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} /></div>
                <div><Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as "Male" | "Female" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Parent Contact</Label><Input value={form.parentContact} onChange={(e) => setForm({ ...form, parentContact: e.target.value })} /></div>
                <div className="col-span-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              </div>
              <Button onClick={handleSave} className="mt-3 w-full">{editStudent ? "Update" : "Add"} Student</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="border-0 bg-muted" />
            </div>
            <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setPage(1); }}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Classes</SelectItem>{["8","9","10","11","12"].map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filterSection} onValueChange={(v) => { setFilterSection(v); setPage(1); }}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Section" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Sections</SelectItem>{["A","B","C"].map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead><TableHead>Section</TableHead><TableHead>Roll No</TableHead><TableHead>Contact</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.class}</TableCell>
                    <TableCell>{s.section}</TableCell>
                    <TableCell>{s.rollNo}</TableCell>
                    <TableCell className="text-xs">{s.parentContact}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewStudent(s)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-muted-foreground">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Student Profile</DialogTitle></DialogHeader>
          {viewStudent && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{viewStudent.name}</span></div>
              <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{viewStudent.id}</span></div>
              <div><span className="text-muted-foreground">Class:</span> {viewStudent.class}-{viewStudent.section}</div>
              <div><span className="text-muted-foreground">Roll No:</span> {viewStudent.rollNo}</div>
              <div><span className="text-muted-foreground">Gender:</span> {viewStudent.gender}</div>
              <div><span className="text-muted-foreground">DOB:</span> {viewStudent.dob}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {viewStudent.email}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Parent Contact:</span> {viewStudent.parentContact}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {viewStudent.address}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
