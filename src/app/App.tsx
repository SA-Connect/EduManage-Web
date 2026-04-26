import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Providers } from './providers'
import { AuthProvider } from '@/store/auth'
import { Spinner } from '@/components/ui/spinner'

function App() {
  return (
    <Providers>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <Spinner size="xl" />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </Providers>
  )
}

export default App
