import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockTransportRoutes } from "@/data/mockData";
import { Bus, MapPin, Users } from "lucide-react";

export default function Transport() {
  const { students } = useData();

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Transport Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-primary/10 text-primary"><Bus className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Total Routes</p><p className="text-xl font-bold">{mockTransportRoutes.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-accent/10 text-accent"><Users className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Students Using</p><p className="text-xl font-bold">{mockTransportRoutes.reduce((a, r) => a + r.assigned.length, 0)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-warning/10 text-warning"><MapPin className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Total Stops</p><p className="text-xl font-bold">{mockTransportRoutes.reduce((a, r) => a + r.stops.length, 0)}</p></div>
        </CardContent></Card>
      </div>

      {mockTransportRoutes.map((route) => (
        <Card key={route.id}>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base flex items-center gap-2"><Bus className="h-4 w-4" /> {route.routeName}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{route.busNo}</Badge>
                <Badge variant={route.assigned.length >= route.capacity ? "destructive" : "secondary"}>
                  {route.assigned.length}/{route.capacity} seats
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              {route.stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-xs">{stop}</span>
                  {i < route.stops.length - 1 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {route.assigned.map((id) => {
                const s = students.find((st) => st.id === id);
                return s ? (
                  <span key={id} className="text-xs bg-muted px-2 py-1 rounded">{s.name}</span>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
