import { Search, Bell, Sun } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const notifications = [
  { id: '1', title: 'Fee Reminder', message: 'Term fees due by April 30th', read: false, date: '2026-04-13' },
  { id: '2', title: 'Exam Schedule', message: 'Mid-term exams start May 5th', read: false, date: '2026-04-12' },
  { id: '3', title: 'Holiday', message: 'School closed on April 18th', read: true, date: '2026-04-10' },
]

export function Header() {
  const [showNotif, setShowNotif] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const notifRef = useRef<HTMLDivElement>(null)

  console.log('Header rendering')

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="flex items-center gap-2.5 flex-1 bg-slate-800 rounded-xl px-3.5 py-2 transition-all">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search students, events, circulars..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-400 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-xl hover:bg-slate-800 transition-all text-slate-400">
          <Sun className="h-[18px] w-[18px]" />
        </button>

        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="p-2.5 rounded-xl hover:bg-slate-800 transition-all text-slate-400 relative"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-sm text-white">Notifications</p>
                <p className="text-xs text-slate-400">{unreadCount} unread</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className={cn('w-full text-left p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors', !n.read && 'bg-blue-900/20')}
                  >
                    <div className="flex items-center gap-2.5">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                      <span className="text-sm font-medium text-white">{n.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 ml-4">{n.message}</p>
                    <p className="text-[10px] text-slate-500 mt-1.5 ml-4">{n.date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-700 mx-1" />

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            D
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold leading-none text-white">Demo User</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Delhi Public School</p>
          </div>
        </div>
      </div>
    </header>
  )
}