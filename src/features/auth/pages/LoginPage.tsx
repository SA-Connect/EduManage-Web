import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/store/auth";
import { ALLOWED_ROLES, Role, LoginRequest } from "@/types/api.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setIsLoggingIn(true);
    setError("");

    try {
      const request: LoginRequest = { email, password };
      const response = await api.post<{
        success: boolean;
        data: {
          token: string;
          userId: string;
          email: string;
          firstName: string;
          lastName: string;
          role: Role;
          organizationId: string;
        };
      }>("/auth/login", request);
      const {
        token,
        userId,
        email: responseEmail,
        firstName,
        lastName,
        role,
        organizationId,
      } = response.data.data;

      if (!ALLOWED_ROLES.includes(role)) {
        throw new Error("This account is not allowed to access this portal.");
      }

      const user = {
        id: userId,
        firstName,
        lastName,
        email: responseEmail,
        role,
        organizationId,
      };
      setAuth(user, token);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { message?: string; response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <form
          className={cn(
            "w-full max-w-lg transition-all duration-500",
          )}
          onSubmit={handleLogin}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">EduPortal</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              School Management Platform
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoggingIn}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold gradient-primary border-0 hover:opacity-90 transition-opacity rounded-xl"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Spinner size="default" className="mr-2 text-white" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
