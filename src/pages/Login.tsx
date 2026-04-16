import { useState } from "react";
import { useAppContext, Role } from "@/contexts/AppContext";
import { GraduationCap, Shield, User, Users, BookOpen, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roles: { value: Role; label: string; description: string; icon: any; gradient: string }[] = [
  { value: "superadmin", label: "Super Admin", description: "Platform administrator — manage organizations & permissions", icon: Shield, gradient: "from-purple-500 to-indigo-600" },
  { value: "principal", label: "Principal", description: "Full school access — manage staff, students & operations", icon: GraduationCap, gradient: "from-blue-500 to-indigo-600" },
  { value: "staff", label: "Staff", description: "Teaching & non-teaching — attendance, grades & materials", icon: Users, gradient: "from-emerald-500 to-teal-600" },
  { value: "student", label: "Student", description: "View grades, attendance, timetable & learning materials", icon: BookOpen, gradient: "from-amber-500 to-orange-600" },
];

export default function Login() {
  const { login, darkMode, toggleDarkMode } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<Role>("principal");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      login(selectedRole);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-6 right-6 z-10">
        <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all">
          {darkMode ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className={cn("w-full max-w-lg transition-all duration-500", isLoggingIn && "opacity-0 scale-95")}>
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">EduPortal</h1>
            <p className="text-muted-foreground mt-2 text-sm">School Management Platform</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 mb-8">
            <p className="text-sm font-medium text-muted-foreground text-center mb-4">Select your role to continue</p>
            {roles.map((r) => {
              const isSelected = selectedRole === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setSelectedRole(r.value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-elevated"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-card"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br text-white", r.gradient)}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 shrink-0 transition-all flex items-center justify-center",
                    isSelected ? "border-primary bg-primary" : "border-border"
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleLogin}
            className="w-full h-12 text-base font-semibold gradient-primary border-0 hover:opacity-90 transition-opacity rounded-xl"
            size="lg"
          >
            Sign In as {roles.find((r) => r.value === selectedRole)?.label}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            This is a demo portal. No real credentials are required.
          </p>
        </div>
      </div>
    </div>
  );
}
