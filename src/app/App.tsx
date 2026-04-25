import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Providers } from './providers'
import { AuthProvider } from '@/store/auth'

function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

function App() {
  return (
    <Providers>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </Providers>
  )
}

export default App