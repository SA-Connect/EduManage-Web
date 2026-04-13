import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "sonner";
import { Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const typeColors = {
  Cultural: "bg-primary/10 text-primary border-primary/20",
  Technical: "bg-info/10 text-info border-info/20",
  Sports: "bg-accent/10 text-accent border-accent/20",
};

export default function Events() {
  const { events, registerForEvent, unregisterFromEvent, students } = useData();
  const { role } = useAppContext();
  const [viewEvent, setViewEvent] = useState<string | null>(null);
  const myId = students[0]?.id || "";

  const handleToggle = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;
    if (ev.registeredStudents.includes(myId)) {
      unregisterFromEvent(eventId, myId);
      toast.success("Unregistered");
    } else {
      if (ev.registeredStudents.length >= ev.maxCapacity) { toast.error("Event is full"); return; }
      registerForEvent(eventId, myId);
      toast.success("Registered!");
    }
  };

  const selectedEvent = events.find((e) => e.id === viewEvent);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <Card key={ev.id} className={cn("border", typeColors[ev.type])}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{ev.title}</CardTitle>
                <Badge variant="outline">{ev.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{ev.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ev.date}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.venue}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ev.registeredStudents.length}/{ev.maxCapacity}</span>
              </div>
              <div className="flex gap-2">
                {role === "student" && (
                  <Button
                    size="sm"
                    variant={ev.registeredStudents.includes(myId) ? "destructive" : "default"}
                    onClick={() => handleToggle(ev.id)}
                  >
                    {ev.registeredStudents.includes(myId) ? "Unregister" : "Register"}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setViewEvent(ev.id)}>View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewEvent} onOpenChange={() => setViewEvent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedEvent?.title}</DialogTitle></DialogHeader>
          {selectedEvent && (
            <div className="space-y-3">
              <p className="text-sm">{selectedEvent.description}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>📅 {selectedEvent.date}</span>
                <span>📍 {selectedEvent.venue}</span>
                <span>👥 {selectedEvent.registeredStudents.length}/{selectedEvent.maxCapacity}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Registered Students:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.registeredStudents.map((id) => {
                    const s = students.find((st) => st.id === id);
                    return s ? <span key={id} className="text-xs bg-muted px-2 py-1 rounded">{s.name}</span> : null;
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
