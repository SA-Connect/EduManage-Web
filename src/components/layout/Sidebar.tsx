import { useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Users, ClipboardCheck, Calendar, FileText, DollarSign,
  Building, Megaphone, CalendarDays, PartyPopper, BookOpen, Bus,
  GraduationCap, Settings, Shield, Building2, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
}

const orgNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Students', icon: Users, path: '/students' },
  { label: 'Attendance', icon: ClipboardCheck, path: '/attendance' },
  { label: 'Timetable', icon: Calendar, path: '/timetable' },
  { label: 'Exams & Grades', icon: FileText, path: '/exams' },
  { label: 'Fees', icon: DollarSign, path: '/fees' },
  { label: 'Hostel', icon: Building, path: '/hostel' },
  { label: 'Transport', icon: Bus, path: '/transport' },
  { label: 'Circulars', icon: Megaphone, path: '/circulars' },
  { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { label: 'Events', icon: PartyPopper, path: '/events' },
  { label: 'Learning', icon: BookOpen, path: '/learning' },
]

const superAdminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Organizations', icon: Building2, path: '/admin/organizations' },
  { label: 'Permissions', icon: Shield, path: '/admin/permissions' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

export function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const isAdmin = location.pathname.startsWith('/admin')
  const items = isAdmin ? superAdminNavItems : orgNavItems

  console.log('Sidebar rendering, path:', location.pathname)

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 flex flex-col bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 z-30',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-bold text-base text-white block">EduPortal</span>
            <span className="text-[10px] text-slate-400 truncate block">Delhi Public School</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-3 mb-2">
            {isAdmin ? 'Platform' : 'Menu'}
          </p>
        )}
        {items.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-11 border-t border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}