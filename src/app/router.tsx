import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const StudentsPage = lazy(() => import('@/features/student/pages/StudentsPage'))
const AttendancePage = lazy(() => import('@/features/attendance/pages/AttendancePage'))
const TimetablePage = lazy(() => import('@/features/academic/pages/TimetablePage'))
const ExamsPage = lazy(() => import('@/features/exam/pages/ExamsPage'))
const FeesPage = lazy(() => import('@/features/fee/pages/FeesPage'))
const HostelPage = lazy(() => import('@/features/hostel/pages/HostelPage'))
const TransportPage = lazy(() => import('@/features/transport/pages/TransportPage'))
const CircularsPage = lazy(() => import('@/features/communication/pages/CircularsPage'))
const AcademicCalendarPage = lazy(() => import('@/features/academic/pages/AcademicCalendarPage'))
const EventsPage = lazy(() => import('@/features/events/pages/EventsPage'))
const LearningPage = lazy(() => import('@/features/learning/pages/LearningPage'))
const SuperAdminDashboardPage = lazy(() => import('@/features/superadmin/pages/SuperAdminDashboardPage'))
const OrganizationsPage = lazy(() => import('@/features/superadmin/pages/OrganizationsPage'))
const PermissionsPage = lazy(() => import('@/features/superadmin/pages/PermissionsPage'))
const SettingsPage = lazy(() => import('@/features/superadmin/pages/SettingsPage'))
const NotFoundPage = lazy(() => import('@/features/auth/pages/NotFoundPage'))

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'timetable', element: <TimetablePage /> },
      { path: 'exams', element: <ExamsPage /> },
      { path: 'fees', element: <FeesPage /> },
      { path: 'hostel', element: <HostelPage /> },
      { path: 'transport', element: <TransportPage /> },
      { path: 'circulars', element: <CircularsPage /> },
      { path: 'calendar', element: <AcademicCalendarPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'learning', element: <LearningPage /> },
    ],
  },

  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <SuperAdminDashboardPage /> },
      { path: 'organizations', element: <OrganizationsPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])