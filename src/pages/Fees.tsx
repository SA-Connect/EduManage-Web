import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DollarSign, Download, Search, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Fees() {
  const { students, fees, payFee } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const enrichedFees = fees.map((f) => ({
    ...f,
    student: students.find((s) => s.id === f.studentId),
  }));

  const filtered = enrichedFees.filter((f) => {
    const matchSearch = f.student?.name.toLowerCase().includes(search.toLowerCase()) || f.studentId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = fees.filter((f) => f.status === "Paid").reduce((a, f) => a + f.amount, 0);
  const totalPending = fees.filter((f) => f.status === "Pending").reduce((a, f) => a + f.amount, 0);

  const pieData = [
    { name: "Collected", value: totalCollected },
    { name: "Pending", value: totalPending },
  ];
  const colors = ["hsl(160,60%,45%)", "hsl(38,92%,50%)"];

  const handlePay = (feeId: string) => {
    payFee(feeId);
    toast.success("Payment simulated successfully!");
  };

  const downloadReceipt = (f: typeof enrichedFees[0]) => {
    const text = `RECEIPT\n\nStudent: ${f.student?.name}\nID: ${f.studentId}\nType: ${f.type}\nAmount: ₹${f.amount}\nStatus: Paid\nDate: ${f.paidDate || new Date().toISOString().slice(0, 10)}\n\nThank you!`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${f.id}.txt`;
    a.click();
    toast.success("Receipt downloaded");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Fee Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-accent/10 text-accent"><DollarSign className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Collected</p><p className="text-xl font-bold">₹{totalCollected.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-lg bg-warning/10 text-warning"><DollarSign className="h-6 w-6" /></div>
          <div><p className="text-sm text-muted-foreground">Pending</p><p className="text-xl font-bold">₹{totalPending.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center justify-center p-2">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" paddingAngle={3}>
              {pieData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-0 bg-muted" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 20).map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.student?.name || f.studentId}</TableCell>
                  <TableCell>{f.type}</TableCell>
                  <TableCell>₹{f.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{f.dueDate}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.status === "Paid" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"}`}>{f.status}</span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {f.status === "Pending" ? (
                      <Button size="sm" onClick={() => handlePay(f.id)} className="h-7 text-xs"><CreditCard className="h-3 w-3 mr-1" /> Pay</Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => downloadReceipt(f)} className="h-7 text-xs"><Download className="h-3 w-3 mr-1" /> Receipt</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
