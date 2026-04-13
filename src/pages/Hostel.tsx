import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockHostelRooms } from "@/data/mockData";
import { Building, Users } from "lucide-react";

export default function Hostel() {
  const { students } = useData();
  const [rooms] = useState(mockHostelRooms);

  const totalBeds = rooms.reduce((a, r) => a + r.capacity, 0);
  const occupied = rooms.reduce((a, r) => a + r.occupants.length, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Hostel Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-primary/10 text-primary"><Building className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Total Rooms</p><p className="text-xl font-bold">{rooms.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-accent/10 text-accent"><Users className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Occupied</p><p className="text-xl font-bold">{occupied}/{totalBeds}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-warning/10 text-warning"><Building className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Available Beds</p><p className="text-xl font-bold">{totalBeds - occupied}</p></div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Room {room.roomNo}</CardTitle>
                <Badge variant={room.occupants.length >= room.capacity ? "destructive" : "outline"}>
                  {room.occupants.length >= room.capacity ? "Full" : `${room.capacity - room.occupants.length} beds free`}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Block {room.block}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {room.occupants.map((id) => {
                  const s = students.find((st) => st.id === id);
                  return s ? (
                    <div key={id} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                      <span>{s.name}</span>
                      <span className="text-xs text-muted-foreground">Class {s.class}</span>
                    </div>
                  ) : null;
                })}
                {room.occupants.length === 0 && <p className="text-sm text-muted-foreground">No occupants</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
