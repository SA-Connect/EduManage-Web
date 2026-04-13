import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { DataProvider } from "@/contexts/DataContext";
import { MainLayout } from "@/components/layout/MainLayout";
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
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <DataProvider>
          <Sonner />
          <BrowserRouter>
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
          </BrowserRouter>
        </DataProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
