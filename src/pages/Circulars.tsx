import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/AppContext";

const categoryColors = {
  Academic: "bg-primary/10 text-primary",
  Event: "bg-accent/10 text-accent",
  Urgent: "bg-destructive/10 text-destructive",
};

export default function Circulars() {
  const { circulars, addCircular } = useData();
  const { role } = useAppContext();
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Academic" as "Academic" | "Event" | "Urgent" });

  const filtered = filter === "all" ? circulars : circulars.filter((c) => c.category === filter);

  const handleAdd = () => {
    if (!form.title) { toast.error("Title is required"); return; }
    addCircular({ ...form, date: new Date().toISOString().slice(0, 10), author: role === "admin" ? "Admin" : "Staff" });
    toast.success("Circular published");
    setDialogOpen(false);
    setForm({ title: "", description: "", category: "Academic" });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Circulars & Announcements</h1>
        {role !== "student" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Circular</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Circular</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Academic">Academic</SelectItem><SelectItem value="Event">Event</SelectItem><SelectItem value="Urgent">Urgent</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAdd} className="w-full">Publish</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-2">
        {["all", "Academic", "Event", "Urgent"].map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted"><Megaphone className="h-5 w-5 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                      <span className="text-xs text-muted-foreground">by {c.author}</span>
                    </div>
                  </div>
                </div>
                <Badge className={categoryColors[c.category]}>{c.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
