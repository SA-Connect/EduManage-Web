import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
  'animate-spin text-primary',
  {
    variants: {
      size: {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-6 w-6',
        xl: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  fullPage?: boolean
  className?: string
}

export function Spinner({ size, fullPage, className }: SpinnerProps) {
  const content = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(spinnerVariants({ size, className }))}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )

  if (fullPage) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}