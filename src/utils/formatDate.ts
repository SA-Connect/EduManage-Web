import { format } from 'date-fns'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy')
}