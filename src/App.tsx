import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { DataProvider } from "@/contexts/DataContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Attendance from "@/pages/Attendance";
import Timetable from "@/pages/Timetable";
import Exams from "@/pages/Exams";
import Fees from "@/pages/Fees";
import Hostel from "@/pages/Hostel";
import Transport from "@/pages/Transport";
import Circulars from "@/pages/Circulars";
import AcademicCalendar from "@/pages/AcademicCalendar";
import Events from "@/pages/Events";
import Learning from "@/pages/Learning";
import SuperAdminDashboard from "@/pages/admin/SuperAdminDashboard";
import Organizations from "@/pages/admin/Organizations";
import Permissions from "@/pages/admin/Permissions";
import Settings from "@/pages/admin/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn, role } = useAppContext();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  if (role === "superadmin") {
    return (
      <MainLayout>
        <Routes>
          <Route path="/admin" element={<SuperAdminDashboard />} />
          <Route path="/admin/organizations" element={<Organizations />} />
          <Route path="/admin/permissions" element={<Permissions />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/hostel" element={<Hostel />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/circulars" element={<Circulars />} />
        <Route path="/calendar" element={<AcademicCalendar />} />
        <Route path="/events" element={<Events />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <DataProvider>
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
