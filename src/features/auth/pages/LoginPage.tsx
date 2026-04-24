import { useState } from 'react'
import { GraduationCap, Shield, User, Users, BookOpen, ArrowRight, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Role, LoginResponse, LoginRequest } from '@/types/api.types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import api from '@/lib/axios'

const roles: { value: Role; label: string; description: string; icon: React.ElementType; gradient: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Platform administrator — manage organizations & permissions', icon: Shield, gradient: 'from-purple-500 to-indigo-600' },
  { value: 'ORGANIZATION_ADMIN', label: 'Principal', description: 'Full school access — manage staff, students & operations', icon: GraduationCap, gradient: 'from-blue-500 to-indigo-600' },
  { value: 'ACCOUNTANT', label: 'Accountant', description: 'Fee collection, reports & financial management', icon: User, gradient: 'from-green-500 to-teal-600' },
  { value: 'TEACHER', label: 'Staff', description: 'Teaching & non-teaching — attendance, grades & materials', icon: Users, gradient: 'from-emerald-500 to-teal-600' },
  { value: 'STUDENT', label: 'Student', description: 'View grades, attendance, timetable & learning materials', icon: BookOpen, gradient: 'from-amber-500 to-orange-600' },
]

import { useState } from 'react'
import { GraduationCap, Shield, User, Users, BookOpen, ArrowRight, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Role, LoginRequest } from '@/types/api.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import api from '@/lib/axios'

const roles: { value: Role; label: string; description: string; icon: React.ElementType; gradient: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Platform administrator — manage organizations & permissions', icon: Shield, gradient: 'from-purple-500 to-indigo-600' },
  { value: 'ORGANIZATION_ADMIN', label: 'Principal', description: 'Full school access — manage staff, students & operations', icon: GraduationCap, gradient: 'from-blue-500 to-indigo-600' },
  { value: 'ACCOUNTANT', label: 'Accountant', description: 'Fee collection, reports & financial management', icon: User, gradient: 'from-green-500 to-teal-600' },
  { value: 'TEACHER', label: 'Staff', description: 'Teaching & non-teaching — attendance, grades & materials', icon: Users, gradient: 'from-emerald-500 to-teal-600' },
  { value: 'STUDENT', label: 'Student', description: 'View grades, attendance, timetable & learning materials', icon: BookOpen, gradient: 'from-amber-500 to-orange-600' },
]

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<Role>('ORGANIZATION_ADMIN')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setIsLoggingIn(true)
    setError('')

    try {
      const request: LoginRequest = { email, password }
      const response = await api.post<LoginRequest & { token: string; userId: string; firstName: string; lastName: string; role: Role; organizationId: string }>('/auth/login', request)
      const { token, userId, firstName, lastName, role, organizationId } = response.data

      const user = {
        id: userId,
        firstName,
        lastName,
        email,
        mobile: '',
        role,
        organizationId,
        organizationName: '',
      }
      setAuth(user, token)
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      setError(axiosError.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={cn('w-full max-w-lg transition-all duration-500', isLoggingIn && 'opacity-0 scale-95')}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">EduPortal</h1>
            <p className="text-muted-foreground mt-2 text-sm">School Management Platform</p>
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
                  className="pl-10 h-12"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-sm font-medium text-muted-foreground text-center mb-4">Select your role to continue</p>
            {roles.map((r) => {
              const isSelected = selectedRole === r.value
              return (
                <button
                  key={r.value}
                  onClick={() => setSelectedRole(r.value)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-elevated'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-card'
                  )}
                >
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br text-white', r.gradient)}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 shrink-0 transition-all flex items-center justify-center',
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              )
            })}
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full h-12 text-base font-semibold gradient-primary border-0 hover:opacity-90 transition-opacity rounded-xl"
            size="lg"
          >
            {isLoggingIn ? 'Signing in...' : `Sign In as ${roles.find((r) => r.value === selectedRole)?.label}`}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            This is a demo portal. No real credentials are required.
          </p>
        </div>
      </div>
    </div>
  )
}