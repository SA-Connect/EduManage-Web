import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { BookOpen, FileText, Video, Link as LinkIcon, Plus, Download, Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const iconMap = { PDF: FileText, Video: Video, Link: LinkIcon };
const categoryColors = { Notes: "bg-primary/10 text-primary", Assignment: "bg-warning/10 text-warning", "Recorded Lecture": "bg-info/10 text-info", "Practice Quiz": "bg-accent/10 text-accent" };

export default function Learning() {
  const { learningMaterials, addLearningMaterial } = useData();
  const { role } = useAppContext();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "Mathematics", category: "Notes" as any, class: "10", fileType: "PDF" as any, url: "#", teacher: "Mr. Ramesh" });

  // Mock progress data
  const [progress] = useState<Record<string, number>>({
    Mathematics: 72, Physics: 58, Chemistry: 45, English: 85, "Computer Science": 30,
  });

  const subjects = [...new Set(learningMaterials.map((m) => m.subject))];

  const filtered = learningMaterials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject === "all" || m.subject === filterSubject;
    const matchCategory = filterCategory === "all" || m.category === filterCategory;
    return matchSearch && matchSubject && matchCategory;
  });

  const handleAdd = () => {
    if (!form.title) { toast.error("Title required"); return; }
    addLearningMaterial({ ...form, uploadDate: new Date().toISOString().slice(0, 10), id: "" } as any);
    toast.success("Material uploaded");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Learning Materials</h1>
        {role !== "student" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Upload Material</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload Learning Material</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Subject</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Mathematics","Physics","Chemistry","English","Hindi","Computer Science","Biology","History"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Notes","Assignment","Recorded Lecture","Practice Quiz"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Class</Label>
                  <Select value={form.class} onValueChange={(v) => setForm({ ...form, class: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["8","9","10","11","12"].map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full">Upload</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {role === "student" && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent" /> Progress Tracker</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(progress).map(([subject, pct]) => (
              <div key={subject} className="space-y-1">
                <div className="flex justify-between text-sm"><span>{subject}</span><span className="text-muted-foreground">{pct}%</span></div>
                <Progress value={pct} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-muted" />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Subjects</SelectItem>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Categories</SelectItem>{["Notes","Assignment","Recorded Lecture","Practice Quiz"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => {
          const Icon = iconMap[m.fileType] || FileText;
          return (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted"><Icon className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{m.title}</h3>
                    <p className="text-xs text-muted-foreground">{m.subject} • Class {m.class}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={categoryColors[m.category] || "bg-muted"} variant="secondary">{m.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{m.uploadDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">by {m.teacher}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs" onClick={() => toast.success("Download started (mock)")}>
                  <Download className="h-3 w-3 mr-1" /> {role === "student" ? "Download" : "View"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
