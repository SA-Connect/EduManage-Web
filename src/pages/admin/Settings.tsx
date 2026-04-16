import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Shield, Database, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Settings() {
  const handleSave = () => toast.success("Settings saved (demo)");

  const sections = [
    {
      title: "Platform Settings",
      icon: Globe,
      gradient: "from-purple-500 to-indigo-600",
      items: [
        { label: "Platform Name", type: "input", value: "EduPortal" },
        { label: "Support Email", type: "input", value: "support@eduportal.com" },
        { label: "Max Organizations", type: "input", value: "100" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      gradient: "from-blue-500 to-indigo-600",
      items: [
        { label: "Email Notifications", type: "toggle", value: true },
        { label: "SMS Alerts", type: "toggle", value: false },
        { label: "Push Notifications", type: "toggle", value: true },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      gradient: "from-emerald-500 to-teal-600",
      items: [
        { label: "Two-Factor Authentication", type: "toggle", value: false },
        { label: "Session Timeout (minutes)", type: "input", value: "30" },
        { label: "IP Whitelisting", type: "toggle", value: false },
      ],
    },
    {
      title: "Data Management",
      icon: Database,
      gradient: "from-amber-500 to-orange-600",
      items: [
        { label: "Auto Backup", type: "toggle", value: true },
        { label: "Backup Frequency", type: "input", value: "Daily" },
        { label: "Data Retention (days)", type: "input", value: "365" },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure global platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="shadow-card border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", section.gradient)}>
                  <section.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{item.label}</Label>
                  {item.type === "toggle" ? (
                    <Switch defaultChecked={item.value as boolean} />
                  ) : (
                    <Input defaultValue={item.value as string} className="w-40 text-right" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary border-0 rounded-xl px-8">Save Settings</Button>
      </div>
    </div>
  );
}
