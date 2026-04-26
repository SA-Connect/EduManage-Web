import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl font-semibold mt-4">Page Not Found</p>
      <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-6 text-primary hover:underline">Go to Dashboard</Link>
    </div>
  )
}
