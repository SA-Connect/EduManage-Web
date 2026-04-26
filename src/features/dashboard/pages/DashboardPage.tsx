import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ClipboardCheck, DollarSign, Calendar, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  change: string
  positive: boolean
  gradient: string
}

function StatCard({ label, value, icon: Icon, change, positive, gradient }: StatCardProps) {
  return (
    <Card className="shadow-card border-border/50 hover:shadow-elevated transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg', gradient)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg', positive ? 'text-accent bg-accent/10' : 'text-warning bg-warning/10')}>
            <ArrowUpRight className="h-3 w-3" />
            {change}
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your organization overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="1,247" icon={Users} change="+12%" positive gradient="from-blue-500 to-indigo-600" />
        <StatCard label="Attendance Rate" value="94%" icon={ClipboardCheck} change="+2.1%" positive gradient="from-emerald-500 to-teal-600" />
        <StatCard label="Pending Fees" value="₹2.5L" icon={DollarSign} change="18 students" positive={false} gradient="from-amber-500 to-orange-600" />
        <StatCard label="Upcoming Events" value="3" icon={Calendar} change="this week" positive gradient="from-purple-500 to-pink-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Dashboard content coming soon. This component is ready for integration with API data.</p>
        </CardContent>
      </Card>
    </div>
  )
}
